package Server.api.account;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import Server.db.Database;
import Server.db.Hash;
import Server.mail.Mail;

@Path(Account.BASE_PATH + "/" + Account.RECOVER_PATH)
public class Recover {

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(@HeaderParam(Account.EMAIL_HEADER) String email, @HeaderParam(Account.CODE_HEADER) String code,
			@HeaderParam(Account.PASSWORD_HEADER) String password) {
		if (!Database.hasConnection()) {
			return Response.status(Status.SERVICE_UNAVAILABLE).build();
		}
		AccountObject acc = Account.getAccount(email);
		if (acc != null) {
			if (!Account.clearUserTokens(acc.id)) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}
		} else {
			return Response.status(Status.CONFLICT).build();
		}
		if (!Account.securityCodeValid(acc, code)) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if (!Account.validPassword(password)) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if (!changePassword(email, password)) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		return Response.ok().build();
	}

	private static boolean changePassword(String email, String password) {
		String hash = Hash.createHash(password);
		if (Database.updateTable("account", "email", email, "pw_hash", hash) == null) {
			return false;
		}
		String token = Account.createSecurityToken(email);
		return token != null && sendRecoverEmail(email, token);
	}

	private static boolean sendRecoverEmail(String email, String code) {
		return Mail.sendRecoverMail(email, code);
	}
}