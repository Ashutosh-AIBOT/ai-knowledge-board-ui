import { useState } from "react";
import { extractPdf, synthesizeText } from "../services/api";

const FileUpload = ({ onProcessed }) => {
    const [status, setStatus] = useState("idle");

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setStatus("uploading");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const extractRes = await extractPdf(formData);

            const rawText = extractRes.text;
            setStatus("synthesizing");

            const synthesizeRes = await synthesizeText({
                text: rawText
            });

            const responseData = synthesizeRes.data;
            if (responseData.error) {
                throw new Error(responseData.error);
            }

            const wikiJson = responseData.candidates[0].content.parts[0].text;
            onProcessed(wikiJson, file.name);
            setStatus("idle");
        } catch (error) {
            console.error(error);
            setStatus("error");
            const msg = error?.response?.data?.error || error?.message || "Unknown error";
            if (msg.includes("429") || msg.includes("Too Many")) {
                alert("Rate limit reached. Wait 1 minute and try again.");
            } else {
                alert("Error: " + msg);
            }
        }
    };

    return (
        <div className="file-upload-wrapper">
            <label className={`lit-search-btn pdf-btn ${status !== 'idle' ? 'active-glow' : ''}`}>
                {status === "idle" && "📂 PDF"}
                {status === "uploading" && "📤 Ext..."}
                {status === "synthesizing" && "🧠 Syn..."}
                {status === "error" && "🔄 Retry"}
                <input type="file" accept=".pdf" onChange={handleFileChange}
                    style={{ display: "none" }}
                    disabled={status === "uploading" || status === "synthesizing"} />
            </label>
        </div>
    );
};

export default FileUpload;
