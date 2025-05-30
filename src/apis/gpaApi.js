const API_URL = 'http://localhost:5000/api'; // Backend server URL

// Hàm trợ giúp để lấy Access Token
const getAccessToken = () => {
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
        credentials: 'include', // Important for cookies
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${url}`, config);
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server response was not JSON');
        }

        const responseData = await response.json();

        if (!response.ok) {
            // Handle 401 Unauthorized error
            if (response.status === 401) {
                // Try to refresh token using authApi
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ refreshToken })
                        });

                        if (refreshResponse.ok) {
                            const refreshData = await refreshResponse.json();
                            localStorage.setItem('accessToken', refreshData.accessToken);
                            localStorage.setItem('refreshToken', refreshData.refreshToken);
                            
                            // Retry the original request with new token
                            return apiRequest(url, method, data);
                        }
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Clear tokens and redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    throw new Error('Session expired. Please login again.');
                }
            }
            
            throw new Error(responseData.message || 'Đã xảy ra lỗi khi gọi API');
        }

        return responseData;
    } catch (error) {
        console.error('API Request Error:', error);
        
        // Improve error message for network/server issues
        if (error.message === 'Failed to fetch') {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        }
        if (error.message === 'Server response was not JSON') {
            throw new Error('Lỗi định dạng phản hồi từ server. Vui lòng thử lại sau.');
        }
        
        throw error;
    }
};

// API calls cho GPA

// Lấy tất cả mục nhập GPA của người dùng
export const getUserGpaEntriesApi = () => apiRequest('/gpa');

// Thêm mục nhập GPA mới
export const createGpaEntryApi = (gpaEntryData) => apiRequest('/gpa', 'POST', gpaEntryData);

// Lấy dữ liệu GPA cho biểu đồ hiệu suất
export const getGpaPerformanceApi = () => apiRequest('/gpa/performance', 'GET');

// Cập nhật mục nhập GPA
export const updateGpaEntryApi = (id, gpaData) => apiRequest(`/gpa/${id}`, 'PUT', gpaData);

// Xóa mục nhập GPA
export const deleteGpaEntryApi = (id) => apiRequest(`/gpa/${id}`, 'DELETE');

// Thêm nhiều mục nhập GPA mới cùng lúc
export const createBulkGpaEntriesApi = (gpaEntriesData) => apiRequest('/gpa/bulk', 'POST', gpaEntriesData);