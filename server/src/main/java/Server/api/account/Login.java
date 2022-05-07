package Server.api.account;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import Server.Utils;
import Server.db.Database;
import Server.db.Hash;

@Path(Account.BASE_PATH + "/" + Account.LOGIN_PATH)
public class Login {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(@HeaderParam(Account.EMAIL_HEADER) String email,
			@HeaderParam(Account.PASSWORD_HEADER) String password) {
		if (!Database.hasConnection()) {
			return Response.status(Status.SERVICE_UNAVAILABLE).build();
		}
		AccountObject acc = Account.getAccount(email);
		if (acc == null) {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		if (!loginValid(password, acc.hash)) {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		String token = createLoginToken(acc.id);
		if (token == null) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		return Response.ok(Account.toJson(Utils.wrap("token", token))).build();
	}

	private static String createLoginToken(int id) {
		String token = null;
		do {
			token = Hash.randomToken();
		} while (Account.checkLoginToken(token));
		if (Database.insertToken("login_token", id, token,
				"DATE_ADD(NOW(), INTERVAL " + Account.LOGIN_TOKEN_TIMEOUT_AMOUNT + " HOUR)") == null) {
			return null;
		}
		return token;
	}

	private static boolean loginValid(String password, String hash) {
		return Hash.checkPassword(password, hash);
	}
}