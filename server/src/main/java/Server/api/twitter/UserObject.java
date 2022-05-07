package Server.api.twitter;

import Server.api.ItemObject;

class UserObject implements ItemObject {
	public String avatar;
	public String fullname;
	public String username;
	public String location;
	public String bio;
	public String url;
	public long tweets;
	public long following;
	public long followers;
}