package Server.api.account;

import java.util.Map;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import Server.Utils;
import Server.api.Api;
import Server.db.Database;

@Path(Account.BASE_PATH + "/" + Account.UPDATE_PATH)
public class Update {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@HeaderParam(Api.AUTH_TOKEN_HEADER) String token) {
		if (!Database.hasConnection()) {
			return Response.status(Status.SERVICE_UNAVAILABLE).build();
		}
		if (!Account.checkLoginToken(token)) {
			return Response.status(Status.FORBIDDEN).build();
		}
		AccountObject account = Database.getAccount("id", Database.getAccountId("login_token", token));
		if (account == null) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		account.buildTreeFolder();
		account.filterUnseen();
		return Response.ok(Account.toJson(account)).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(@Context HttpHeaders headers) {
		if (!Database.hasConnection()) {
			return Response.status(Status.SERVICE_UNAVAILABLE).build();
		}
		String token = headers.getRequestHeader(Api.AUTH_TOKEN_HEADER).get(0);
		if (token == null) {
			return Response.status(Status.FORBIDDEN).build();
		}
		Integer acc = Database.getAccountId("login_token", token);
		if (acc == null) {
			return Response.status(Status.FORBIDDEN).build();
		}
		Map<String, String> headerParams = headers.getRequestHeaders().entrySet().stream()
				.collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue().get(0)));
		if (!Utils.containsAllKeys(headerParams, Utils.arr(Account.UPDATE_METHOD_PARAM, Account.UPDATE_TYPE_PARAM))
				|| Api.typeTableMap.get(headerParams.get(Account.UPDATE_TYPE_PARAM)) == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		
		// do this
		//-------------
		/*switch (headerParams.get(Account.UPDATE_METHOD_PARAM)) {
		case "delete":
			if (!headerParams.containsKey(Account.UPDATE_ID_PARAM)) {
				return Response.status(Status.BAD_REQUEST).build();
			}
			if (Database.deleteItem(Api.typeTableMap.get(headerParams.get(Account.UPDATE_METHOD_PARAM)), "id",
					headerParams.get(Account.UPDATE_ID_PARAM)) == null) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}
			return Response.ok().build();
		case "add":
			if (!Utils.containsAllKeys(headerParams,
					Utils.arr(Account.UPDATE_TITLE_PARAM, Account.UPDATE_URL_PARAM))) {
				return Response.status(Status.BAD_REQUEST).build();
			}
			if(Database.insertItem(
					Api.typeTableMap.get(headerParams.get(Account.UPDATE_METHOD_PARAM)),
					headerParams.get(Account.UPDATE_TITLE_PARAM),
					headerParams.get(Account.UPDATE_URL_PARAM),
					headerParams.get()
					))
		case "modfiy":
			if (!Utils.containsAllKeys(headerParams, Utils.arr(Account.UPDATE_ID_PARAM, Account.UPDATE_TITLE_PARAM,
					Account.UPDATE_URL_PARAM, Account.UPDATE_SOURCE_PARAM))) {
				return Response.status(Status.BAD_REQUEST).build();
			}
		}
		*/
		return Response.status(Status.BAD_REQUEST).build();
	}
}
