const API_URL = process.env.REACT_APP_API_URL || '/api'; // Định nghĩa URL base của API backend

// Hàm trợ giúp để lấy Access Token (Cần điều chỉnh)
const getAccessToken = () => {
    // Đây là nơi bạn sẽ lấy access token từ Redux state hoặc localStorage
    return localStorage.getItem('accessToken');
};

// Hàm trợ giúp cho các request API
const apiRequest = async (url, method = 'GET', data = null) => {
    const token = getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}/auth${url}`, config);

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // If not JSON, read as text and throw an error
            const text = await response.text();
            console.error('Server response was not JSON:', text);
            throw new Error(`Server response was not JSON. Status: ${response.status}`);
        }

        const responseData = await response.json();

        // TODO: Xử lý lỗi 401 và làm mới token

        if (!response.ok) {
            throw new Error(responseData.message || `API request failed with status ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// API calls cho xác thực và hồ sơ

export const registerUserApi = (userData) => apiRequest('/register', 'POST', userData);
export const loginUserApi = (credentials) => apiRequest('/login', 'POST', credentials);
export const refreshTokenApi = () => apiRequest('/refresh-token', 'POST'); // Refresh token thường không cần body, lấy từ cookie
export const logoutUserApi = () => apiRequest('/logout', 'POST'); // Logout thường không cần body, xóa cookie

export const getUserProfileApi = () => apiRequest('/profile', 'GET');
export const updateUserProfileApi = (userData) => apiRequest('/profile', 'PUT', userData);

// New API call to create a GPA entry
export const createGpaEntryApi = (gpaEntryData) => apiRequest('/gpa', 'POST', gpaEntryData);

// Bạn có thể thêm các API khác liên quan đến auth ở đây 