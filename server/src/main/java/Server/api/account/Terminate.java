package Server.api.account;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import Server.db.Database;
import Server.mail.Mail;

@Path(Account.BASE_PATH + "/" + Account.TERMINATE_PATH)
public class Terminate {

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(@HeaderParam(Account.EMAIL_HEADER) String email,
			@HeaderParam(Account.CODE_HEADER) String code) {
		if (!Database.hasConnection()) {
			return Response.status(Status.SERVICE_UNAVAILABLE).build();
		}
		AccountObject acc = Account.getAccount(email);
		if (acc != null) {
			Account.clearUserTokens(acc.id);
		} else {
			return Response.status(Status.CONFLICT).build();
		}
		if (!Account.securityCodeValid(acc, code)) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if (!terminate(email)) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		return Response.ok().build();
	}

	private static boolean terminate(String email) {
		return Database.deleteAccount("email = '" + email + "'") != null && sendTerminateEmail(email);
	}

	private static boolean sendTerminateEmail(String email) {
		return Mail.sendTerminateMail(email);
	}
}