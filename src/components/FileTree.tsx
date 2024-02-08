import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderPlus, faFileCirclePlus, faFile, faFolder } from "@fortawesome/free-solid-svg-icons"
import { ControlledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from "react-complex-tree"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { FileState, addFileAsync, addFolderAsync, fetchFiles, selectFile } from "../store/file/fileSlice"

const FileTree = () => {
  const dispatch = useAppDispatch()
  const [name, setName] = useState("")
  const [showInputForItem, setShowInputForItem] = useState(false)
  const [showInputForFolder, setShowInputForFolder] = useState(false)
  const files = useAppSelector(state => state.files.fileItems)
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

  const items: Record<TreeItemIndex, TreeItem<FileState>> = {}

  files.forEach(file => {
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
      items={items}
      getItemTitle={item => item.data.name}
      viewState={{}}
      canSearch={true}
      canDragAndDrop={true}
      canDropOnFolder={true}
      canReorderItems={true}
      onStartRenamingItem={(item, newName) => alert(`${item.data.name} renamed to ${newName}`)}
      renderItem={({ item, depth, children, title }) => (
        <div style={{ paddingLeft: `${depth * 20}px` }} onClick={() => handleSelectItem([item.index], "tree")}>
          {/* 아이콘과 제목 렌더링 */}
          {item.data.isFolder ? <FontAwesomeIcon icon={faFolder} /> : <FontAwesomeIcon icon={faFile} />}
          {title}
          {/* 하위 아이템들 */}
          {children}
        </div>
      )}
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
        <Tree treeId="tree" rootItem="root" treeLabel="Tree" />
      </div>
    </ControlledTreeEnvironment>
  )
}

export default FileTree
