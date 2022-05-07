package Server.api;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;

import Server.api.account.Account;

@Provider
public class CORSFilter implements ContainerResponseFilter {

	@Override
	public void filter(ContainerRequestContext request, ContainerResponseContext response) throws IOException {
		response.getHeaders().add("Access-Control-Allow-Origin", "*");
		response.getHeaders().addAll("Access-Control-Allow-Headers", headerSet());
	}

	public List<Object> headerSet() {
		Set<String> values = new HashSet<>();
		values.addAll(List.of(Api.getHeaders()));
		values.addAll(List.of(Account.getHeaders()));
		return List.copyOf(values);
	}
}
