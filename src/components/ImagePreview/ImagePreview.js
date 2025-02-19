import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({
                          images,
                          onRemoveImage,
                          maxItems = 5,
                          loading = false,
                          onDrop,
                          className = ''
                      }) => {
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-active');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-active');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-active');
        if (onDrop) onDrop(e);
    };

    return (
        <div
            className={`preview-container ${className}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {images.length >= maxItems && (
                <div className="max-items-warning">
                    Maximum number of images reached ({maxItems})
                </div>
            )}

            {images.map((item, index) => (
                <div
                    key={index}
                    className={`preview-item ${loading ? 'preview-item-loading' : ''}`}
                >
                    <div className="file-type-indicator">
                        {item.file.type.split('/')[1]}
                    </div>

                    <img
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        className="preview-image"
                    />

                    <button
                        className="remove-image-btn"
                        onClick={() => onRemoveImage(index)}
                        aria-label="Remove image"
                    >
                        ×
                    </button>

                    <div className="preview-item-overlay">
                        {item.file.name}
                    </div>

                    {item.progress && (
                        <div
                            className="upload-progress"
                            style={{ width: `${item.progress}%` }}
                        />
                    )}
                </div>
            ))}

            {images.length === 0 && (
                <div className="image-placeholder">
                    +
                </div>
            )}
        </div>
    );
};

export default ImagePreview;
