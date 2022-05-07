package Server;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import Server.api.Api;

public abstract class Utils {

	public static JsonElement wrap(String key, Object value) {
		JsonObject res = new JsonObject();
		res.add(key, Api.gson.toJsonTree(value));
		return res;
	}

	public static String[] arr(String... elements) {
		return elements;
	}

	public static String[] arr(Object... elements) {
		return Arrays.stream(elements).map(String::valueOf).toArray(String[]::new);
	}

	public static <T> T[] concat(T[] first, T[] second) {
		T[] result = Arrays.copyOf(first, first.length + second.length);
		System.arraycopy(second, 0, result, first.length, second.length);
		return result;
	}

	public static String quote(String element) {
		return "'" + element + "'";
	}

	public static String quote(Object value) {
		if (value instanceof String) {
			return quote((String) value);
		} else {
			return String.valueOf(value);
		}
	}

	public static String[] quoteArr(Object... elements) {
		return Arrays.stream(elements).map(Utils::quote).toArray(String[]::new);
	}

	public static StringBuilder iterateArray(StringBuilder sb, boolean brackets, Object... array) {
		return iterateArray(sb, brackets, arr(array));
	}

	public static StringBuilder iterateArray(StringBuilder sb, boolean brackets, String... array) {
		if (array != null) {
			if (brackets) {
				sb.append("(");
			}
			ListIterator<String> arrayItr = List.of(array).listIterator();
			while (arrayItr.hasNext()) {
				sb.append(arrayItr.next());
				if (arrayItr.hasNext()) {
					sb.append(", ");
				}
			}
			if (brackets) {
				sb.append(")");
			}
		}
		return sb;
	}

	public static <T> boolean containsAllKeys(Map<T, ?> map, Collection<T> col) {
		for (T element : col) {
			if (!map.containsKey(element)) {
				return false;
			}
		}
		return true;
	}

	public static <T> boolean containsAllKeys(Map<T, ?> map, T[] elements) {
		return containsAllKeys(map, List.of(elements));
	}

	public static final class Unary {
	}

	public static interface BiFunctionThrows<P1, P2, R> {
		R apply(P1 p1, P2 p2) throws Exception;
	}

	public static class UnexpectedExceptionException extends RuntimeException {

		private static final long serialVersionUID = -8826418715810623243L;

		public UnexpectedExceptionException(Exception e) {
			super(e);
		}
	}
}
