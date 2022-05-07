package Server.db;

import java.security.SecureRandom;

import org.mindrot.jbcrypt.BCrypt;

public abstract class Hash {

	private static final SecureRandom RANDOM = new SecureRandom();
	private static final String CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~";
	private static final int TOKEN_LENGTH = 32;
	
	public static String createHash(String password) {
		return BCrypt.hashpw(password, BCrypt.gensalt());
	}

	public static boolean checkPassword(String password, String hash) {
		return BCrypt.checkpw(password, hash);
	}

	public static String randomToken() {
		char[] chars = new char[TOKEN_LENGTH];
		for (int i = 0; i < chars.length; i++) {
			chars[i] = CHAR_POOL.charAt(RANDOM.nextInt(CHAR_POOL.length()));
		}
		return new String(chars);
	}
}
