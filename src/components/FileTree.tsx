import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderPlus, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { ControlledTreeEnvironment, Tree, InteractionMode, TreeItem, TreeItemIndex } from "react-complex-tree"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { FileState, addFileAsync, addFolderAsync, fetchFiles, selectFile } from "../store/file/fileSlice"
import { renderers } from "./renderers"

const FileTree = () => {
  const dispatch = useAppDispatch()
  const [name, setName] = useState("")
  const [showInputForItem, setShowInputForItem] = useState(false)
  const [showInputForFolder, setShowInputForFolder] = useState(false)
  const files = useAppSelector(state => state.files.files)
  const selectedFileId = useAppSelector(state => state.files.selectedFileId)

  useEffect(() => {
    dispatch(fetchFiles())
  }, [dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleInputKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter") {
      callback()
      setName("")
      setShowInputForItem(false)
      setShowInputForFolder(false)
    }
  }

  const injectItem = () => {
    setShowInputForItem(true)
    setShowInputForFolder(false)
  }

  const injectFolder = () => {
    setShowInputForFolder(true)
    setShowInputForItem(false)
  }

  const injectName = () => {
    dispatch(addFileAsync(name))
  }

  const injectFolderName = () => {
    dispatch(addFolderAsync(name))
  }

  const items: Record<TreeItemIndex, TreeItem<FileState>> = {} // 아이템 객체 초기화

  files.forEach(file => {
    // 파일 및 폴더를 TreeItem으로 변환하여 items에 추가
    items[file.id] = {
      index: file.id,
      data: file,
      children: file.children || []
    }
  })

  const handleSelectItem = (items: TreeItemIndex[], treeId: string) => {
    if (items && items.length > 0) {
      const selectedItemId = items[0]
      dispatch(selectFile(selectedItemId as string))
    }
  }

  return (
    <ControlledTreeEnvironment
      items={items} // 파일 및 폴더 데이터 전달
      getItemTitle={item => item.data.name}
      viewState={{}}
      canDragAndDrop={true}
      canDropOnFolder={true}
      canReorderItems={true}
      defaultInteractionMode={InteractionMode.ClickItemToExpand}
      onRenameItem={(item, newName) => alert(`${item.data.name} renamed to ${newName}`)}
      onSelectItems={handleSelectItem}
      {...renderers}
    >
      <div className="flex justify-between space-x-2 mb-7 items-center mt-3 px-4">
        <h3 className="text-2xl text-white">Project</h3>
        <button type="button" onClick={injectItem} className="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md">
          <FontAwesomeIcon icon={faFileCirclePlus} />
        </button>
        <button
          type="button"
          onClick={injectFolder}
          className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
        >
          <FontAwesomeIcon icon={faFolderPlus} />
        </button>
        {showInputForItem && (
          <input
            type="text"
            value={name}
            onChange={handleInputChange}
            onKeyPress={e => handleInputKeyPress(e, injectName)}
            placeholder="Enter name and press Enter"
            className="p-2 border rounded-md"
          />
        )}
        {showInputForFolder && (
          <input
            type="text"
            value={name}
            onChange={handleInputChange}
            onKeyPress={e => handleInputKeyPress(e, injectFolderName)}
            placeholder="Enter name and press Enter"
            className="p-2 border rounded-md"
          />
        )}
      </div>
      <div style={{ color: "#e3e3e3", borderTop: "1px solid #e3e3e3", paddingTop: "30px" }}>
        <Tree treeId="tree-2" rootItem="root" treeLabel="Tree Example" />
      </div>
    </ControlledTreeEnvironment>
  )
}

export default FileTree
