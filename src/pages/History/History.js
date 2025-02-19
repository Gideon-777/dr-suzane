// src/pages/History/History.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config/config';
import './History.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [page]);

    const fetchHistory = async () => {
        try {
            setError(null);
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await getHistory(page, config.PAGINATION.DEFAULT_PAGE_SIZE);

            if (page === 1) {
                setHistory(response.predictions);
            } else {
                setHistory(prev => [...prev, ...response.predictions]);
            }

            setTotalPages(Math.ceil(response.total / config.PAGINATION.DEFAULT_PAGE_SIZE));
        } catch (error) {
            setError(error.error || 'Unable to load prediction history. Please try again.');
            console.error('History fetch error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleRetry = () => {
        setPage(1);
        fetchHistory();
    };

    const loadMore = () => {
        if (page < totalPages && !loadingMore) {
            setPage(prev => prev + 1);
        }
    };

    // Loading State
    if (loading) {
        return (
            <motion.div
                className="history-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="loading-container">
                    <LoadingSpinner size="large" />
                    <p className="loading-text">Loading your prediction history...</p>
                </div>
            </motion.div>
        );
    }

    // Error State
    if (error) {
        return (
            <motion.div
                className="history-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="error-content">
                    <i className="fas fa-exclamation-circle"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button
                        className="retry-button"
                        onClick={handleRetry}
                    >
                        <i className="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            </motion.div>
        );
    }

    // Empty State
    if (!loading && history.length === 0) {
        return (
            <motion.div
                className="history-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="empty-content">
                    <i className="fas fa-history"></i>
                    <h3>No Predictions Yet</h3>
                    <p>Start analyzing images to build your prediction history.</p>
                    <Link
                        to="/"
                        className="start-button"
                        aria-label="Start new analysis"
                    >
                        <i className="fas fa-plus"></i>
                        Start New Analysis
                    </Link>
                </div>
            </motion.div>
        );
    }

    // Main Content
    return (
        <motion.div
            className="history-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="history-header">
                <h2>Prediction History</h2>
                <Link
                    to="/"
                    className="new-analysis-button"
                    aria-label="Create new analysis"
                >
                    <i className="fas fa-plus"></i>
                    New Analysis
                </Link>
            </div>

            <div className="history-grid">
                <AnimatePresence>
                    {history.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="history-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="image-container">
                                <img
                                    src={`${config.API.FULL_API_URL}/image/${item.image_url}`}
                                    alt={`Prediction ${item.id}`}
                                    className="history-image"
                                    loading="lazy"
                                    crossOrigin="use-credentials"
                                />
                                <div className="image-overlay">
                                    <span className={`prediction-badge ${item.prediction.toLowerCase()}`}>
                                        {item.prediction}
                                    </span>
                                </div>
                            </div>

                            <div className="history-details">
                                <div className="confidence-meter">
                                    <div className="confidence-label">
                                        Confidence Score
                                    </div>
                                    <div className="confidence-bar">
                                        <div
                                            className="confidence-fill"
                                            style={{width: `${item.confidence}%`}}
                                        />
                                        <span className="confidence-value">
                                            {item.confidence.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="timestamp">
                                    <i className="far fa-clock"></i>
                                    {new Date(item.timestamp + 'Z').toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZoneName: 'short'
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {page < totalPages && (
                <div className="load-more">
                    <button
                        className="load-more-button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        aria-label={loadingMore ? "Loading more results" : "Load more results"}
                    >
                        {loadingMore ? (
                            <>
                                <LoadingSpinner size="small" />
                                <span>Loading more...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-chevron-down"></i>
                                <span>Load More</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {history.length > 0 && page === totalPages && (
                <div className="end-message">
                    <p>You've reached the end of your prediction history</p>
                </div>
            )}

            {/* Pagination Info */}
            <div className="pagination-info">
                <p>
                    Showing {history.length} of {totalPages * config.PAGINATION.DEFAULT_PAGE_SIZE} results
                </p>
            </div>
        </motion.div>
    );
};

export default History;
