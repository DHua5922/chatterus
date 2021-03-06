import axios from "axios";
import { apiLinks } from "../../constants";

/**
 * This service performs password operations.
 */
export default class PasswordService {
    static readonly API_BASE: string = "password/";

    /**
     * Sends link for resetting password to the user's email.
     * 
     * @param {string} email Email to send reset link to.
     * @param {string} resetPageUrl Password reset page link.
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static sendResetLink(email: string, resetPageUrl: string) {
        return axios.post(apiLinks.sendResetLink, {
            email,
            resetPageUrl
        });
    }

    /**
     * Resets the user's password.
     * 
     * @param {string} password New password.
     * @param {string} cpassword Confirm new password.
     * @param {string} token Token.
     * @return {Promise<AxiosResponse<any>>} Promise with API response.
     */
    static resetPassword(password: string, cpassword: string, token: string) {
        return axios.post(apiLinks.resetPassword, {
            password,
            cpassword,
            token,
        });
    }
}