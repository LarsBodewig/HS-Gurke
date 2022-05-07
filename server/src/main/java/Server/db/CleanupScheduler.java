package Server.db;

import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import Server.Utils;

@WebListener
public class CleanupScheduler implements ServletContextListener {

	private static final long DELAY = 10000;
	private static final long PERIOD = 600000;
	private static final Timer TIMER = new Timer();
	private static final TimerTask TASK = new CleanupTask();

	static class CleanupTask extends TimerTask {
		public void run() {
			Database.log("Starting cleanup task...");
			Database.deleteToken("login_token", "valid_until < NOW()");
			Integer[] accToDelete = Database.getAccountIds("verify_token", "valid_until < NOW()");
			if(accToDelete.length>0) {
				Database.deleteAccount("id IN " + Utils.iterateArray(new StringBuilder(), true, (Object[]) accToDelete));
			}
			Database.log("Cleanup of invalid tokens done.");
		}
	};

	public void contextInitialized(ServletContextEvent event) {
		Database.log("Initializing cleanup scheduler...");
		TIMER.schedule(TASK, DELAY, PERIOD);
		Database.log("Cleanup task scheduled: { delay: " + DELAY + ", period: " + PERIOD + " }");
	}

	public void contextDestroyed(ServletContextEvent event) {
		Database.log("Destroying cleanup scheduler...");
		TASK.cancel();
		TIMER.cancel();
		Database.log("Cleanup task and timer cancelled.");
	}
}
