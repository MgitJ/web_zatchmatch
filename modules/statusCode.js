module.exports = {
  //성공응답
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
  //실패응답
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
  //서비스 장애(사용자에게 나타내면 안됨)
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    DB_ERROR: 600,
};
