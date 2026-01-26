import Editor from "../components/Editor";
import ArticleSettings from "../components/ArticleSettings";

export default function WritePage() {
  return (
    <div className="h-screen flex flex-col bg-white">

      <div className="flex justify-between items-center border-b px-8 py-4">
        <span className="font-semibold text-lg">Readme</span>

        <div className="flex gap-4">
          <button className="text-sm text-gray-600">Save Draft</button>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm">
            Publish
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 py-8 flex justify-center overflow-y-auto">
          <div className="w-full max-w-[720px] px-4">
            <Editor />
          </div>
        </div>

        <div className="w-[320px] border-l border-gray-200 px-6 py-8">
          <ArticleSettings />
        </div>

      </div>
    </div>
  );
}
