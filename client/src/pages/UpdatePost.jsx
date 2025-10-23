import { useEffect, useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { postId } = useParams();

  // 🔹 Fetch single post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getpost/${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message || "Failed to fetch post");
          return;
        }
        setFormData(data);

        if (data.content) {
          const blocksFromHtml = htmlToDraft(data.content);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        console.log(error);
        setPublishError("Something went wrong");
      }
    };
    fetchPost();
  }, [postId]);

  // 🔹 Upload image to Cloudinary
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    try {
      setImageUploadError(null);
      setImageUploadProgress(10);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "react_profile_upload");
      data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        { method: "POST", body: data }
      );

      const uploaded = await res.json();
      if (!uploaded.secure_url) throw new Error("Upload failed");

      setFormData((prev) => ({ ...prev, image: uploaded.secure_url }));
      setImageUploadProgress(null);
    } catch (error) {
      console.error(error);
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  // 🔹 Handle editor change
  const handleEditorChange = (state) => {
    setEditorState(state);
    const htmlContent = draftToHtml(convertToRaw(state.getCurrentContent()));
    setFormData((prev) => ({ ...prev, content: htmlContent }));
  };

  // 🔹 Submit updated post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if(res.ok){
        setPublishError(null);
      navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      console.error(error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title & Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            className="flex-1"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={formData.category || "uncategorized"}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        {/* Image upload */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            size="sm"
            className="bg-gradient-to-br from-purple-600 to-blue-500 text-white"
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {/* Preview & errors */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        {/* Editor */}
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName min-h-[200px] p-2 focus:outline-none dark:bg-white dark:text-black text-[1.05rem]"
        />

        {/* Update Button */}
        <Button
          type="submit"
          className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Update
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
