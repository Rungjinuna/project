import React from "react"
import { javascript } from "@codemirror/lang-javascript"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { cpp } from "@codemirror/lang-cpp"
import { java } from "@codemirror/lang-java"
import { materialDark as material } from "@uiw/codemirror-theme-material"
import { autocompletion } from "@codemirror/autocomplete"
import { keymap } from "@codemirror/view"
import { completionKeymap } from "@codemirror/autocomplete"
import { cppCompletions, javaCompletions, pythonCompletions } from "./autocomplete"
import { useAppSelector } from "../hooks/redux"
import { selectSelectedFile } from "../store/file/fileSlice"

const Editor = () => {
  const selectedFile = useAppSelector(selectSelectedFile)

  return (
    <CodeMirror
      theme={material}
      value={selectedFile?.content || ""}
      height="h-screen"
      basicSetup={{
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: false,
        indentOnInput: false,
        lineNumbers: true,
        tabSize: 4
      }}
      extensions={[
        material,
        javascript({ jsx: true }),
        python(),
        cpp(),
        java(),
        autocompletion({ override: [pythonCompletions, javaCompletions, cppCompletions] }),
        keymap.of(completionKeymap)
      ]}
    />
  )
}

export default Editor
