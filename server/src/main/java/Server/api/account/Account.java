package Server.api.account;

import Server.Utils;
import Server.api.Api;
import Server.db.Database;
import Server.db.Hash;

public abstract class Account {

	public static final String BASE_PATH = "account";
	public static final String LOGIN_PATH = "login";
	public static final String LOGOUT_PATH = "logout";
	public static final String RECOVER_PATH = "recover";
	public static final String REGISTER_PATH = "register";
	public static final String TERMINATE_PATH = "terminate";
	public static final String UPDATE_PATH = "update";
	public static final String VERIFY_PATH = "verify";

	public static final String EMAIL_HEADER = "email";
	public static final String PASSWORD_HEADER = "password";
	public static final String CODE_HEADER = "code";

	private static final int PW_MAX_LENGTH = 55;
	static final int LOGIN_TOKEN_TIMEOUT_AMOUNT = 2;
	static final int VERIFY_TOKEN_TIMEOUT_AMOUNT = 15;
	static final String VERIFY_TOKEN_TIMEOUT_INTERVAL = "MINUTE";

	static final String UPDATE_METHOD_PARAM = "method";
	static final String UPDATE_ID_PARAM = "id";
	static final String UPDATE_TYPE_PARAM = "type";
	static final String UPDATE_TITLE_PARAM = "title";
	static final String UPDATE_URL_PARAM = "url";

	static String toJson(Object o) {
		return Api.gson.toJson(o);
	}

	public static boolean checkLoginToken(String token) {
		return Database.tokenExists("login_token", token);
	}

	public static AccountObject getAccount(String email) {
		return Database.getAccount("email", email);
	}

	public static boolean clearUserTokens(int id) {
		return Database.deleteToken("login_token", "acc_id = " + id) != null;
	}

	public static boolean validPassword(String password) {
		return password.length() > 0 && password.length() <= PW_MAX_LENGTH; // min length, numbers?
	}

	public static boolean securityCodeValid(AccountObject acc, String code) {
		return code != null && code.equals(acc.securityCode);
	}

	public static String createSecurityToken(String email) {
		String code = Hash.randomToken();
		if (Database.updateTable("account", "email", email, "security_code", code) == null) {
			return null;
		}
		return code;
	}

	public static String[] getHeaders() {
		return Utils.arr(EMAIL_HEADER, PASSWORD_HEADER, CODE_HEADER, UPDATE_METHOD_PARAM, UPDATE_ID_PARAM, UPDATE_TYPE_PARAM, UPDATE_TITLE_PARAM,
				UPDATE_URL_PARAM);
	}
}
