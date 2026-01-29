import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from '../styles/FoodTruckReviews.module.css';

const FoodTruckReviews = ({ foodtruckId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ average: 0, count: 0 });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/foodtrucks/${foodtruckId}/avis`);
                setReviews(response.data);

                // Calculate average rating
                if (response.data.length > 0) {
                    const avg = response.data.reduce((sum, r) => sum + r.note, 0) / response.data.length;
                    setStats({ average: avg.toFixed(1), count: response.data.length });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setLoading(false);
            }
        };

        fetchReviews();
    }, [foodtruckId]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <svg
                key={i}
                className={styles.star}
                fill={i < rating ? '#fbbc04' : '#e0e0e0'}
                viewBox="0 0 24 24"
            >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
        ));
    };

    const getInitials = (nom, prenom) => {
        const n = nom ? nom.charAt(0).toUpperCase() : '';
        const p = prenom ? prenom.charAt(0).toUpperCase() : '';
        return p + n || 'U';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className={styles.pageFoodTruckReviews}>
                <div className={styles.background}>
                    <div style={{ padding: '40px', textAlign: 'center', color: '#0f0f0f' }}>
                        Chargement des avis...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageFoodTruckReviews}>
            <div className={styles.background}>
                <div className={styles.reviewsContainer}>
                    {/* Review Summary */}
                    <div className={styles.reviewSummary}>
                        <div className={styles.summaryLeft}>
                            <div className={styles.googleBadge}>
                                <svg className={styles.googleLogo} viewBox="0 0 122 40" fill="none">
                                    <text x="0" y="30" fontSize="24" fontFamily="Arial" fontWeight="bold" fill="#4285F4">Google</text>
                                </svg>
                                <div className={styles.ratingLabel}>Rating</div>
                            </div>
                            <div className={styles.ratingInfo}>
                                <div className={styles.ratingValue}>{stats.average}</div>
                                <div className={styles.stars}>
                                    {renderStars(Math.round(stats.average))}
                                </div>
                                <div className={styles.reviewCount}>{stats.count} avis</div>
                            </div>
                        </div>
                        <button className={styles.leaveReviewButton} onClick={() => window.open('https://www.google.com/search?q=' + encodeURIComponent('avis google'), '_blank')}>
                            <div className={styles.leaveReviewText}>Laisser un avis</div>
                            <svg className={styles.externalLinkIcon} fill="white" viewBox="0 0 24 24">
                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                            </svg>
                        </button>
                    </div>

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <div className={styles.noReviews}>
                            Aucun avis pour le moment
                        </div>
                    ) : (
                        <div className={styles.reviewsList}>
                            {reviews.slice(0, 6).map((review) => (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.userAvatar}>
                                            {getInitials(review.nom, review.prenom)}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userName}>
                                                {review.prenom} {review.nom}
                                            </div>
                                            <div className={styles.reviewDate}>
                                                {formatDate(review.date_creation)}
                                            </div>
                                        </div>
                                        <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="#4285F4">
                                            <text x="0" y="18" fontSize="14" fontFamily="Arial" fontWeight="bold">G</text>
                                        </svg>
                                    </div>
                                    <div className={styles.stars}>
                                        {renderStars(review.note)}
                                    </div>
                                    <div className={styles.reviewText}>
                                        <div className={styles.commentText}>
                                            {review.commentaire || 'Pas de commentaire'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* View All Button */}
                    {reviews.length > 6 && (
                        <div className={styles.viewAllButton}>
                            <button className={styles.viewAllBtn}>
                                <div>Voir tous les avis</div>
                                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodTruckReviews;
