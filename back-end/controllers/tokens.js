var models = require('../models/index');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
var uuid = require('node-uuid');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/tokens
     * description: Tokens apis
     */

    /**
     * @swagger
     * path: /api/v1/tokens/refresh
     * operations:
     *   -  httpMethod: GET
     *      summary: Refresh token
     *      notes: Return new accessToken and new refreshToken
     *      nickname: Refresh token
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [refreshToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get new access token and new refresh token */
    refresh: function (req, res) {
        var refreshToken = req.headers.authorization.split(' ')[1];
        if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
            return res.status(403).json({
                success: false,
                message: 'Invalid authorization.'
            });
        }
        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                message: 'No token provided.'
            });
        }
        else {
            jwt.verify(refreshToken, config.jwt.secret, function (err, decoded) {
                if (err || decoded.type !== 'refreshToken') {
                    return res.status(400).json({
                        success: false,
                        message: 'Failed to authenticate. Invalid token.'
                    });
                }
                else {
                    models.BlackListToken.findOne({
                        tokenId: decoded.tokenId
                    }, function (err, isMatch) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                        }
                        else if (isMatch) {
                            return res.status(400).json({
                                success: false,
                                message: 'Invalid refresh token.'
                            });
                        }
                        else {
                            models.UserToken.findOne({
                                userId: decoded.userId
                            }, function (err, userToken) {
                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                }
                                else if (!userToken) {
                                    return res.status(400).json({
                                        success: false,
                                        message: 'Invalid refresh token.'
                                    });
                                }
                                else {
                                    var refreshTokenId = uuid.v4();
                                    jwt.sign({
                                        userId: decoded.userId,
                                        tokenId: refreshTokenId,
                                        type: 'refreshToken'
                                    }, config.jwt.secret, {
                                        expiresIn: config.jwt.expiresTime.refreshToken
                                    }, function (err, refreshToken) {
                                        if (err) {
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                        }
                                        else {
                                            jwt.sign({
                                                userId: decoded.userId,
                                                type: 'accessToken'
                                            }, config.jwt.secret, {
                                                expiresIn: config.jwt.expiresTime.accessToken
                                            }, function (err, accessToken) {
                                                if (err) {
                                                    return res.status(500).json({
                                                        success: false,
                                                        message: err
                                                    });
                                                }
                                                else {
                                                    userToken.update({
                                                        $pull: {
                                                            tokens: {
                                                                tokenId: decoded.tokenId
                                                            }
                                                        }
                                                    }, function (err) {
                                                        if (err) {
                                                            return res.status(500).json({
                                                                success: false,
                                                                message: err
                                                            });
                                                        }
                                                        else {
                                                            userToken.update({
                                                                $push: {
                                                                    tokens: {
                                                                        tokenId: refreshTokenId
                                                                    }
                                                                }
                                                            }, function (err) {
                                                                if (err) {
                                                                    return res.status(500).json({
                                                                        success: false,
                                                                        message: err
                                                                    });
                                                                }
                                                                else {
                                                                    models.BlackListToken.create({
                                                                        tokenId: decoded.tokenId
                                                                    }, function (err) {
                                                                        if (err) {
                                                                            return res.status(500).json({
                                                                                success: false,
                                                                                message: err
                                                                            });
                                                                        }
                                                                        else {
                                                                            return res.json({
                                                                                success: true,
                                                                                accessToken: accessToken,
                                                                                refreshToken: refreshToken
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
};