"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, File, Loader2 } from "lucide-react";
import UploadButton from "./UploadButton";

const UploadDoc = () => {
  const [document, setDocument] = useState<Blob | File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!document) {
      setError("Please upload the document first");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", document as Blob);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (res.status === 200) {
        console.log("Generated successfully");
      }
    } catch (e) {
      console.log("error while generating", e);
    }

    setIsLoading(false);
  };

  return (
    <div className="place-items-center">
      {/* <UploadButton /> */}

      <form onSubmit={handleSubmit} className="justify-center mt-2">
        <div className="border h-40 m-4 border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="document"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center h-full w-full">
                <p><br /><br /></p>
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold text-center">Click to upload</span> or drag
                  and drop
                </p>

                {document && document?.name ? (
                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                    <div className="px-3 py-2 h-full grid place-items-center">
                      <File className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="px-3 py-2 h-full text-sm truncate">
                      {document.name}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <input
                type="file"
                id="document"
                className="relative block w-full h-full z-50 opacity-0"
                onChange={(e) => setDocument(e?.target?.files?.[0])}
              />
            </label>
          </div>
        </div>
        {error ? <p className="red-text-100">{error}</p> : null}
        <p className="text-center">
        <Button size="lg" className="mt-2" type="submit">
          Generate
        </Button>
        </p>
      </form>
    </div>
  );
};

export default UploadDoc;
