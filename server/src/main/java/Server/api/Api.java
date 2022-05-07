package Server.api;

import java.io.PrintStream;
import java.util.Map;

import com.google.gson.Gson;

import Server.Server;
import Server.Utils;

public abstract class Api {

	public static final String AUTH_TOKEN_HEADER = "auth_token";

	public static final Gson gson = new Gson();

	public static final Map<String, String> typeTableMap = Map.of("folder", "folder", "twitter", "item_twitter",
			"youtube", "item_youtube");

	public static void log(String... lines) {
		PrintStream logStream = Server.getLogStream();
		for (String line : lines) {
			logStream.println(line);
		}
	}

	public static void log(Exception exception) {
		exception.printStackTrace(Server.getLogStream());
	}

	public static String[] getHeaders() {
		return Utils.arr(AUTH_TOKEN_HEADER);
	}
}