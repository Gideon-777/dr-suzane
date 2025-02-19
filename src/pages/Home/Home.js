// src/pages/Home/Home.js
import React, { useState, useEffect } from 'react';
import './Home.css';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { predictImages } from '../../utils/api';
import config from '../../config/config';

const Home = () => {
    const [images, setImages] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setInitialLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file types using config
        const invalidFiles = files.filter(file =>
            !config.UPLOAD.SUPPORTED_FORMATS.includes(file.type)
        );
        if (invalidFiles.length > 0) {
            setError(`Please upload only supported formats: ${config.UPLOAD.SUPPORTED_FORMATS.join(', ')}`);
            return;
        }

        // Validate file sizes using config
        const maxSizeMB = config.UPLOAD.MAX_FILE_SIZE / (1024 * 1024);
        const oversizedFiles = files.filter(file => file.size > config.UPLOAD.MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            setError(`Files must be smaller than ${maxSizeMB}MB`);
            return;
        }

        const newFiles = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        // Check total number of images using config
        if (images.length + newFiles.length > config.UPLOAD.MAX_FILES) {
            setError(`Maximum ${config.UPLOAD.MAX_FILES} images allowed`);
            return;
        }

        const combined = [...images, ...newFiles].slice(0, config.UPLOAD.MAX_FILES);
        setImages(combined);
        setPredictions([]);
        setError(null);
        setMessage('Images uploaded successfully! Click "Analyze Images" to proceed.');
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPredictions([]);
        setError(null);
        setMessage('');
    };

    const handleDeleteAll = () => {
        setImages([]);
        setPredictions([]);
        setError(null);
        setMessage('');
    };

    const handlePredict = async () => {
        if (images.length === 0) {
            setError('Please select at least one image to analyze.');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage('Analyzing your images... This may take a moment.');

        try {
            const results = await predictImages(images);
            setPredictions(results);
            setMessage('Analysis completed successfully!');
        } catch (error) {
            console.error('Prediction error:', error);
            setError(
                error.error ||
                'Unable to analyze images. Please ensure they are valid medical images and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files)
            .filter(file => config.UPLOAD.SUPPORTED_FORMATS.includes(file.type))
            .slice(0, config.UPLOAD.MAX_FILES - images.length);

        if (droppedFiles.length === 0) {
            setError(`Please drop valid image files (${config.UPLOAD.SUPPORTED_FORMATS.join(', ')})`);
            return;
        }

        const newFiles = droppedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newFiles]);
        setMessage('Images uploaded successfully! Click "Analyze Images" to proceed.');
    };

    return initialLoading ? (
        <div className="loading-container">
            <LoadingSpinner size="large" />
            <p className="loading-text">Loading Application...</p>
        </div>
    ) : (
        <motion.div
            className="home-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1>Breast Cancer Classification</h1>

            <div className="card">
                <div
                    className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="upload-content">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Drag and drop images here or</p>
                        <label className="upload-btn">
                            Browse Files
                            <input
                                type="file"
                                multiple
                                accept={config.UPLOAD.SUPPORTED_FORMATS.join(',')}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </label>
                        <div className="upload-guidelines">
                            <p>✓ Supported formats: {config.UPLOAD.SUPPORTED_FORMATS.join(', ')}</p>
                            <p>✓ Maximum file size: {config.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB per image</p>
                            <p>✓ Up to {config.UPLOAD.MAX_FILES} images at once</p>
                            <p>✓ For best results, use clear histopathology images</p>
                        </div>
                    </div>
                </div>

                {(error || message) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`message-container ${error ? 'error' : 'success'}`}
                    >
                        <i className={`fas ${error ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                        <p>{error || message}</p>
                    </motion.div>
                )}

                <AnimatePresence>
                    {images.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="analysis-section"
                        >
                            <ImagePreview
                                images={images}
                                onRemoveImage={handleRemoveImage}
                                maxItems={config.UPLOAD.MAX_FILES}
                                loading={loading}
                            />

                            <div className="action-buttons">
                                <button
                                    className="delete-btn"
                                    onClick={handleDeleteAll}
                                    disabled={loading}
                                >
                                    <i className="fas fa-trash"></i>
                                    Delete All
                                </button>
                                <button
                                    className="analyze-btn"
                                    onClick={handlePredict}
                                    disabled={loading || images.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner size="small" />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-microscope"></i>
                                            Analyze Images
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {predictions.length > 0 && (
                        <motion.div
                            className="predictions-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2>Analysis Results</h2>
                            {predictions.map((prediction, index) => (
                                <motion.div
                                    key={index}
                                    className="prediction-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="prediction-content">
                                        <img
                                            src={images[index].preview}
                                            alt={`Preview ${index + 1}`}
                                            className="prediction-image"
                                        />
                                        <div className="prediction-details">
                                            <h3>Image {index + 1}</h3>
                                            <p className={`prediction-result ${prediction.prediction.toLowerCase()}`}>
                                                Classification: {prediction.prediction}
                                            </p>
                                            <div className="confidence-bar">
                                                <div
                                                    className="confidence-fill"
                                                    style={{ width: `${prediction.confidence}%` }}
                                                />
                                                <span>{prediction.confidence.toFixed(2)}% Confidence</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Home;
