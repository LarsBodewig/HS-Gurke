# Backend implementation

Java implementation to request, cache and offer content over REST API

## Twitter
<table>
	<tr>
		<th>Function</th>
		<th>Param</th>
		<th>Description</th>
		<th>Default</th>
	<tr>
		<td>User bio:</td>
		<td>/api/{user}/user</td>
		<td>returns a users profile as json</td>
		<td></td>
	</tr>
	<tr>
		<td>Tweets:</td>
		<td>/api/{user}/posts</td>
		<td>returns a users tweets and retweets</td>
		<td></td>
	</tr>
	<tr>
		<td></td>
		<td>?from={id}</td>
		<td>returns tweets and retweets starting at tweet with id or with the newest tweet</td>
		<td>null</td>
	</tr>
	<tr>
		<td></td>
		<td>&to={id}</td>
		<td>returns tweets and retweets recursively until tweet with id is found or the first 30</td>
		<td>null</td>
	</tr>
	<tr>
		<td></td>
		<td>&replies={boolean}</td>
		<td>returns tweets and retweets including or excluding replies</td>
		<td>true</td>
	</tr>
</table>


### Tweet: 
<table>
	<tr>
		<th>Field</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>id</td>
		<td>String</td>
		<td>the id of the tweet</td>
	</tr>
	<tr>
		<td>author</td>
		<td>String</td>
		<td>the fullname of the author</td>
	</tr>
	<tr>
		<td>source</td>
		<td>String</td>
		<td>the url to the tweet</td>
	</tr>
	<tr>
		<td>post</td>
		<td>String</td>
		<td>the tweet message html</td>
	</tr>
	<tr>
		<td>timestamp</td>
		<td>long</td>
		<td>millis since epoch when the tweet was posted</td>
	</tr>
	<tr>
		<td>reply</td>
		<td>String</td>
		<td>username of the author this tweet is a reply to</td>
	</tr>
	<tr>
		<td>retweet</td>
		<td>boolean</td>
		<td>if tweet is a retweet</td>
	</tr>
	<tr>
		<td>avatar</td>
		<td>String</td>
		<td>src url of the avatar, orginial authors avatar if retweet</td>
	</tr>
	<tr>
		<td>media</td>
		<td>String</td>
		<td>url of embedded media</td>
	</tr>
</table>


### User bio:
<table>
	<tr>
		<th>Field</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>avatar</td>
		<td>String</td>
		<td>src url of the avatar</td>
	</tr>
	<tr>
		<td>fullname</td>
		<td>String</td>
		<td>the full name of the user</td>
	</tr>
	<tr>
		<td>username</td>
		<td>String</td>
		<td>the user name prefixed with @</td>
	</tr>
	<tr>
		<td>location</td>
		<td>String</td>
		<td>the user's location</td>
	</tr>
	<tr>
		<td>bio</td>
		<td>String</td>
		<td>the user's bio</td>
	</tr>
	<tr>
		<td>url</td>
		<td>String</td>
		<td>url set by the user</td>
	</tr>
	<tr>
		<td>tweets</td>
		<td>long</td>
		<td>number of tweets posted by this user</td>
	</tr>
	<tr>
		<td>following</td>
		<td>long</td>
		<td>number of users this user follow</td>
	</tr>
	<tr>
		<td>followers</td>
		<td>long</td>
		<td>snumber of users following this user</td>
	</tr>
</table>
