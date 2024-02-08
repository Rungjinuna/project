import React from "react"
import FileTree from "../../components/FileTree"
import Editor from "../../components/Editor"

const IDEPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 h-full border-r border-gray-300 bg-black">
        <FileTree />
      </div>

      <div className="w-3/4 h-full bg-gray-200">
        <Editor />
      </div>
    </div>
  )
}

export default IDEPage
