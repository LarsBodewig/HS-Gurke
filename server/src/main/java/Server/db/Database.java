package Server.db;

import java.io.PrintStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.stream.Collectors;

import Server.Server;
import Server.Utils;
import Server.Utils.BiFunctionThrows;
import Server.Utils.Unary;
import Server.Utils.UnexpectedExceptionException;
import Server.api.account.AccountObject;
import Server.api.account.MenuItem;
import Server.db.SQL.SelectQuery;
import Server.db.SQL.UpdateQuery;

public class Database {

	static Connection connection = null;

	public static Connection getConnection() {
		return connection;
	}

	public static boolean hasConnection() {
		try {
			return connection != null && connection.isValid(1);
		} catch (SQLException e) {
			log(e);
			return false;
		}
	}

	public static void log(String... lines) {
		PrintStream logStream = Server.getLogStream();
		for (String line : lines) {
			logStream.println(line);
		}
	}

	public static void log(Exception exception) {
		exception.printStackTrace(Server.getLogStream());
	}

	public static <T> T castToClass(ResultSet rs, Class<T> c) {
		Class<?>[] columns = getColumns(rs);
		Object[] parameters = getParameters(rs, columns);
		try {
			Constructor<T> constr = c.getConstructor(columns);
			return constr.newInstance(parameters);
		} catch (NoSuchMethodException | SecurityException | InstantiationException | IllegalAccessException
				| IllegalArgumentException | InvocationTargetException | NullPointerException e) {
			log(e);
			return null;
		}
	}

	public static Object[] getParameters(ResultSet rs, Class<?>[] columns) {
		try {
			Object[] parameters = new Object[columns.length];
			for (int i = 0; i < columns.length; i++) {
				parameters[i] = rs.getObject(i + 1, columns[i]);
			}
			return parameters;
		} catch (SQLException | NullPointerException e) {
			log(e);
			return null;
		}
	}

	public static Class<?>[] getColumns(ResultSet rs) {
		try {
			ResultSetMetaData rsmd = rs.getMetaData();
			Class<?>[] columns = new Class<?>[rsmd.getColumnCount()];
			for (int i = 0; i < columns.length; i++) {
				columns[i] = Class.forName(rsmd.getColumnClassName(i + 1), false, Database.class.getClassLoader());
			}
			return columns;
		} catch (SQLException | ClassNotFoundException | NullPointerException e) {
			log(e);
			return null;
		}
	}

	public static Unary insertToken(String tokenType, int id, String token, String datetime) {
		return executeUpdate(SQL.insertInto(tokenType).values(Utils.arr("acc_id", tokenType, "valid_until"),
				Utils.arr(id, Utils.quote(token), datetime)));
	}

	public static Unary deleteToken(String tokenType, String condition) {
		return executeUpdate(SQL.deleteFrom(tokenType).where(condition));
	}

	public static Unary updateTable(String table, String condColumn, Object condValue, String setColumn,
			Object setValue) {
		return executeUpdate(SQL.update(table).set(setColumn, Utils.quote(setValue))
				.where(condColumn + " = " + Utils.quote(condValue)));
	}

	public static Unary updateTable(String table, String condColumn, Object condValue, Map<String, Object> map) {
		StringBuilder st = new StringBuilder();
		Iterator<Entry<String, Object>> itr = map.entrySet().iterator();
		while (itr.hasNext()) {
			Entry<String, Object> entry = itr.next();
			st.append(entry.getKey() + " = " + Utils.quote(entry.getValue()));
			if (itr.hasNext()) {
				st.append(", ");
			}
		}
		return executeUpdate(SQL.update(table).set(st.toString()).where(condColumn + " = " + Utils.quote(condValue)));
	}

	public static Unary deleteAccount(String condition) {
		return executeUpdate(SQL.deleteFrom("account").where(condition));
	}

	public static Unary insertAccount(String email, String hash, boolean verified) {
		return executeUpdate(SQL.insertInto("account").values(Utils.arr("email", "pw_hash", "verified"),
				Utils.quoteArr(email, hash, verified)));
	}

	public static <V extends MenuItem> Map<Integer, V> getMenuItems(int id, String table, String orderByColumn,
			Class<V> itemClass) {
		Map<?, ?> temp = executeQuery(
				SQL.select("*").from(table).where("acc_id = " + id).orderBy(orderByColumn + " ASC"), (rs, listC) -> {
					Map<Integer, V> map = new TreeMap<>();
					while (rs.next()) {
						map.put(rs.getInt("id"), castToClass(rs, itemClass));
					}
					return map;
				}, Map.class);
		return temp.entrySet().stream()
				.collect(Collectors.toMap(e -> Integer.class.cast(e.getKey()), e -> itemClass.cast(e.getValue())));
	}

	public static Integer getAccountId(String tokenType, String token) {
		return getAccountIds(tokenType, tokenType + " = " + Utils.quote(token))[0];
	}

	public static Integer[] getAccountIds(String tokenType, String condition) {
		Set<?> temp = executeQuery(SQL.select("acc_id").from(tokenType).where(condition), (rs, setC) -> {
			Set<Integer> result = new TreeSet<>();
			while (rs.next()) {
				result.add(rs.getInt("acc_id"));
			}
			return result;
		}, Set.class);
		return temp.stream().toArray(Integer[]::new);
	}

	public static AccountObject getAccount(String column, Object value) {
		return executeQuery(SQL.select("*").from("account").where(column + " = " + Utils.quote(value)), (rs, aoC) -> {
			return (rs.next()) ? castToClass(rs, aoC) : null;
		}, AccountObject.class);
	}

	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
	public static Unary insertItem(String table, String title, String url, String source,
			Map<String, Object> customFields) {
		return executeUpdate(SQL.insertInto(table)
				.values(Utils.concat(Utils.arr("title", "url", "source"),
						customFields.keySet().toArray(new String[customFields.size()])),
						Utils.concat(Utils.arr(title, url, source), Utils.quoteArr(customFields.values().toArray()))));
	}

	public static Unary deleteItem(String table, String conditionColumn, Object columnValue) {
		return executeUpdate(SQL.deleteFrom(table).where(conditionColumn + " = " + Utils.quote(columnValue)));
	}
	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

	public static Boolean tokenExists(String tokenType, String token) {
		return executeQuery(SQL.select("1").from(tokenType).where(tokenType + " = " + Utils.quote(token)),
				(rs, boolC) -> rs.next(), Boolean.class);
	}

	public static <T> T executeQuery(SelectQuery query, BiFunctionThrows<ResultSet, Class<T>, T> transform,
			Class<T> objC) {
		BiFunctionThrows<Statement, String, ResultSet> exec = (st, sql) -> st.executeQuery(sql);
		return execute(exec, query.query(), transform, SQLException.class, objC);
	}

	public static Unary executeUpdate(UpdateQuery query) {
		BiFunctionThrows<Statement, String, Integer> exec = (st, sql) -> st.executeUpdate(sql);
		BiFunctionThrows<Integer, Class<Unary>, Unary> transform = (i, unaryClass) -> new Unary();
		return execute(exec, query.query(), transform, SQLException.class, Unary.class);
	}

	private static <R1, R2, E extends Exception> R2 execute(BiFunctionThrows<Statement, String, R1> exec, String query,
			BiFunctionThrows<R1, Class<R2>, R2> transform, Class<E> exceptionClass, Class<R2> transformClass) {
		Statement st = null;
		try {
			st = Database.connection.createStatement();
			R1 r = exec.apply(st, query);
			return transform.apply(r, transformClass);
		} catch (Exception e) {
			if (exceptionClass.isInstance(e)) {
				Database.log(query);
				Database.log(e);
				return null;
			}
			throw new UnexpectedExceptionException(e);
		} finally {
			if (st != null) {
				try {
					st.close();
				} catch (SQLException e) {
					Database.log(e);
				}
			}
		}
	}
}
