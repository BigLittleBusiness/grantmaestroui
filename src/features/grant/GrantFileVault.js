import React, { useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFile } from './grantSlice'

// ---------------------------------------------------------------------------
// File type helpers
// ---------------------------------------------------------------------------
const getFileIcon = (filename) => {
  const ext = (filename || '').split('.').pop().toLowerCase()
  if (ext === 'pdf')
    return { icon: '📄', cls: 'gm-file-icon--pdf',   label: 'PDF'   }
  if (['xls', 'xlsx', 'csv'].includes(ext))
    return { icon: '📊', cls: 'gm-file-icon--excel', label: 'Excel' }
  if (['doc', 'docx'].includes(ext))
    return { icon: '📝', cls: 'gm-file-icon--word',  label: 'Word'  }
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext))
    return { icon: '🖼️', cls: 'gm-file-icon--image', label: 'Image' }
  return   { icon: '📎', cls: 'gm-file-icon--other', label: 'File'  }
}

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return null
  if (bytes < 1024)          return `${bytes} B`
  if (bytes < 1048576)       return `${(bytes / 1024).toFixed(1)} KB`
  return                            `${(bytes / 1048576).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const GrantFileVault = () => {
  const dispatch = useDispatch()
  const files    = useSelector((state) => state.grant.files)

  const [isDragging, setIsDragging]   = useState(false)
  const [pendingFile, setPendingFile] = useState(null)
  const [error, setError]             = useState('')
  const fileInputRef                  = useRef(null)

  // -------------------------------------------------------------------------
  // Drag-and-drop handlers
  // -------------------------------------------------------------------------
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      setPendingFile(dropped)
      setError('')
    }
  }, [])

  const handleFileInput = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setPendingFile(selected)
      setError('')
    }
  }

  // -------------------------------------------------------------------------
  // Upload / cancel
  // -------------------------------------------------------------------------
  const handleUpload = () => {
    if (!pendingFile) {
      setError('Please select a file first.')
      return
    }
    dispatch(addFile({ file: pendingFile }))
    setPendingFile(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCancel = () => {
    setPendingFile(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className='col-xl-6 col-md-6'>
      <div className='card super-admin-dash-card p-2 pt-3 mb-0'>
        {/* Card header */}
        <div className='card-header'>
          <div className='d-flex justify-content-between align-items-center'>
            <h5 className='card-title mb-0'>File Vault</h5>
            <span className='badge bg-secondary'>
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className='card-body file-vault p-2'>
          {/* Drag-and-drop upload zone */}
          <div
            className={`gm-dropzone${isDragging ? ' gm-dropzone--active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label='Upload file — click or drag and drop'
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>📁</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {isDragging ? 'Drop file here' : 'Click or drag & drop to upload'}
            </div>
            <div style={{ fontSize: 11, color: '#6c757d', marginTop: 2 }}>
              PDF, Word, Excel, images and more
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type='file'
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />

          {/* Staged file preview + upload controls */}
          {pendingFile && (
            <div
              className='mt-2 p-2'
              style={{
                background: '#f0f2f5',
                borderRadius: 8,
                border: '1px solid #dee2e6',
              }}
            >
              <div className='d-flex align-items-center gap-2'>
                <span style={{ fontSize: 20 }}>{getFileIcon(pendingFile.name).icon}</span>
                <div className='flex-grow-1' style={{ minWidth: 0 }}>
                  <div
                    className='fw-semibold text-truncate'
                    style={{ fontSize: 13 }}
                    title={pendingFile.name}
                  >
                    {pendingFile.name}
                  </div>
                  {pendingFile.size > 0 && (
                    <div style={{ fontSize: 11, color: '#6c757d' }}>
                      {formatBytes(pendingFile.size)}
                    </div>
                  )}
                </div>
              </div>
              {error && <div className='text-danger small mt-1'>{error}</div>}
              <div className='d-flex gap-2 mt-2'>
                <button className='btn btn-primary btn-sm' onClick={handleUpload}>
                  Upload
                </button>
                <button
                  className='btn btn-outline-secondary btn-sm'
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* File list */}
          <div className='mt-2'>
            {files.length === 0 ? (
              <div className='gm-empty-state' style={{ padding: '20px 0' }}>
                <div className='gm-empty-state__icon' style={{ fontSize: 28 }}>📂</div>
                <p className='gm-empty-state__body mb-0' style={{ fontSize: 13 }}>
                  No files uploaded yet
                </p>
              </div>
            ) : (
              files.map((file, index) => {
                const name          = file?.file?.name || file?.file_path || 'File'
                const size          = file?.file?.size || null
                const { icon, cls } = getFileIcon(name)
                return (
                  <div key={index} className='gm-file-item'>
                    <span className={`gm-file-icon ${cls}`}>{icon}</span>
                    <div className='flex-grow-1' style={{ minWidth: 0 }}>
                      <div
                        className='text-truncate'
                        style={{ fontSize: 13, fontWeight: 500 }}
                        title={name}
                      >
                        {name}
                      </div>
                      {size && (
                        <div style={{ fontSize: 11, color: '#6c757d' }}>
                          {formatBytes(size)}
                        </div>
                      )}
                    </div>
                    {file?.file_path && (
                      <a
                        href={file.file_path}
                        target='_blank'
                        rel='noreferrer'
                        className='btn btn-sm btn-outline-secondary'
                        style={{ fontSize: 11, padding: '2px 8px', flexShrink: 0 }}
                        title='Download'
                        onClick={(e) => e.stopPropagation()}
                      >
                        ↓
                      </a>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GrantFileVault
