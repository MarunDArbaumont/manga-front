const id = (value: string | number) => encodeURIComponent(String(value))

export const endpoints = {
    csrf: "/auth/csrf/",
    me: "/me/",
    login: "/auth/login/",
    logout: "/auth/logout/",

    users: "/users/",
    user: (userId: string | number) => `/users/${id(userId)}/`,
    profileByUser: (userId: string | number) => `/users/${id(userId)}/profile/`,
    profiles: "/profiles/",
    profile: (profileId: string | number) => `/profiles/${id(profileId)}/`,
    addToCollection: "/profiles/add_manga/",
    removeFromCollection: "/profiles/remove_manga/",

    reviews: "/reviews/",
    review: (reviewId: string | number) => `/reviews/${id(reviewId)}/`,
    reviewLike: (reviewId: string | number) => `/reviews/${id(reviewId)}/like/`,
    reviewDislike: (reviewId: string | number) => `/reviews/${id(reviewId)}/dislike/`,
    reviewReaction: (reviewId: string | number) => `/reviews/${id(reviewId)}/reaction/`,

    series: "/series/",
    serie: (serieId: string | number) => `/series/${id(serieId)}/`,
    authors: "/authors/",
    author: (authorId: string | number) => `/authors/${id(authorId)}/`,
    chapters: "/chapters/",
    chapter: (chapterId: string | number) => `/chapters/${id(chapterId)}/`,
}
