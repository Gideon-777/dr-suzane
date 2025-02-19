const config = {
    API: {
        BASE_URL: process.env.REACT_APP_API_BASE_URL,
        API_PATH: process.env.REACT_APP_API_PATH,
        AUTH_PATH: process.env.REACT_APP_AUTH_PATH,
        FULL_API_URL: `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_PATH}`,
        FULL_AUTH_URL: `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_AUTH_PATH}`,
    },
    UPLOAD: {
        MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE),
        MAX_FILES: parseInt(process.env.REACT_APP_MAX_FILES),
        SUPPORTED_FORMATS: process.env.REACT_APP_SUPPORTED_FORMATS.split(','),
    },
    PAGINATION: {
        DEFAULT_PAGE_SIZE: parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE),
    },
};

export default config;
