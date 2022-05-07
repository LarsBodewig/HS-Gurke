package Server;

import java.io.PrintStream;

public abstract class Server {

	private static final PrintStream logStream = System.out;

	public static final String PROTOCOL = "http";
	public static final String HOST = "localhost";
	// public static final int PORT_BACKEND = 8080;
	// public static final String PATH_BACKEND = "api";
	public static final int PORT_FRONTEND = 8100;
	public static final String VERIFY_PATH_FRONTEND = "verify";

	public static PrintStream getLogStream() {
		return logStream;
	}
}
