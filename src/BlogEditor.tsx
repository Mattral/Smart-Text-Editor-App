import React, { ChangeEvent, useEffect, useState } from "react";

const BlogEditor = () => {
    const [text, setText] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);

    const API_KEY = process.env.REACT_APP_AI21_API_KEY;



////////////

const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
};

const handleChangeLink = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
};



const handleGenerateCompletion = () => {
    setLoading(true)
fetch("https://api.ai21.com/studio/v1/j2-ultra/complete", {
headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
},
body: JSON.stringify({
    "prompt": text,
    "numResults": 1,
    "maxTokens": 200,
    "temperature": 0.7,
    "topKReturn": 0,
    "topP": 1,
    "countPenalty": {
        "scale": 0,
        "applyToNumbers": false,
        "applyToPunctuations": false,
        "applyToStopwords": false,
        "applyToWhitespaces": false,
        "applyToEmojis": false
    },
    "frequencyPenalty": {
        "scale": 0,
        "applyToNumbers": false,
        "applyToPunctuations": false,
        "applyToStopwords": false,
        "applyToWhitespaces": false,
        "applyToEmojis": false
    },
    "presencePenalty": {
        "scale": 0,
        "applyToNumbers": false,
        "applyToPunctuations": false,
        "applyToStopwords": false,
        "applyToWhitespaces": false,
        "applyToEmojis": false
    },
    "stopSequences": []
}),
method: "POST"
}).then((response) => response.json())
.then((data) => {
    console.log('Success:', data);
    setLoading(false)
    setText(text + data.completions[0].data.text)
})
.catch((error) => {
    setLoading(false)
    console.error('Error:', error);
});
};


/////////////

const handleFixGrammar = () => {
    setLoading(true)
fetch("https://api.ai21.com/studio/v1/gec", {
headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
},
body: JSON.stringify({
    "text": text,
}),
method: "POST"
}).then((response) => response.json())
.then((data) => {
    console.log('Success:', data);
    setLoading(false)
    let corrections = data.corrections
    let correctedText = text;
    corrections.forEach((curr_correction: any) => {
        correctedText =
            correctedText.slice(0, curr_correction.startIndex) +
            curr_correction.suggestion +
            correctedText.slice(curr_correction.endIndex);
    });

    setText(correctedText)
})
.catch((error) => {
    setLoading(false)
    console.error('Error:', error);
});
};


////////////


const handleParaphrase = () => {
    setLoading(true)
fetch("https://api.ai21.com/studio/v1/paraphrase", {
headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
},
body: JSON.stringify({
    "text": text,
}),
method: "POST"
}).then((response) => response.json())
.then((data) => {
    console.log('Success:', data);
    setLoading(false)
    let suggestions = data.suggestions

    setText(suggestions[0].text)
})
.catch((error) => {
    setLoading(false)
    console.error('Error:', error);
});
};

////////////////



const handleImproveText = () => {
    setLoading(true)
fetch("https://api.ai21.com/studio/v1/improvements", {
headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
},
body: JSON.stringify({
    "text": text,
    "types": ['fluency', 'vocabulary/specificity', 'vocabulary/variety', 'clarity/short-sentences', 'clarity/conciseness']
}),
method: "POST"
}).then((response) => response.json())
.then((data) => {
    console.log('Success:', data);
    setLoading(false)
    let improvements = data.improvements
    improvements.sort((a: any, b: any) => b.startIndex - a.startIndex);

    let improvedText = text;
    improvements.forEach((curr_improvement: any) => {
        const firstSuggestion = curr_improvement.suggestions[0];
        improvedText =
            improvedText.slice(0, curr_improvement.startIndex) +
            firstSuggestion +
            improvedText.slice(curr_improvement.endIndex);
    });

    setText(improvedText)
})
.catch((error) => {
    setLoading(false)
    console.error('Error:', error);
});
};




///////////////////



const handleSummarizeLink = () => {
    setLoading(true)
fetch("https://api.ai21.com/studio/v1/summarize", {
headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
},
body: JSON.stringify({
    "source": link,
    "sourceType": "URL",
}),
method: "POST"
}).then((response) => response.json())
.then((data) => {
    console.log('Success:', data);
    setLoading(false)
    // let suggestions = data.suggestions

    setText(data.summary)
})
.catch((error) => {
    setLoading(false)
    console.error('Error:', error);
});
};



////////////////


return (
    <div className="flex flex-col">
                <p className="text-lg mt-6 self-center font-bold">Text Editor, Fix Paraphrase and Improve your Text</p>
        <div className="blog-editor p-8 bg-white rounded shadow-lg">
            <textarea
                className={`blog-text-input w-full h-64 p-4 mb-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring focus:border-blue-300 ${loading ? 'opacity-50' : ''}`}
                value={text}
                onChange={handleChangeText}
                placeholder="Write your blog post here..."
                disabled={loading}
            />

            {/* Loading indicator */}
            {loading && (
                <div className="w-full h-64 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}

            <div className="actions space-x-2 mb-4">
                <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleGenerateCompletion}
                >
                    Generate Completion
                </button>
                <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleFixGrammar}
                >
                    Fix Grammar
                </button>
                <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleParaphrase}
                >
                    Paraphrase
                </button>
                <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleImproveText}
                >
                    Improve Text
                </button>
            </div>
            <div className="link-section flex items-center space-x-2">
                <input
                    type="text"
                    className="link-input flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    value={link}
                    onChange={handleChangeLink}
                    placeholder="Insert link here..."
                />
                <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleSummarizeLink}
                >
                    Summarize Link
                </button>
            </div>
        </div>
    </div>
);
};

export default BlogEditor;


