package com.sensotrend.spa;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet implementation class SPAErrorHandler
 */
@WebServlet(
		description = "Returns the default page with HTTP status 200 OK when unknown resources are requested. To support arbitrary paths in SPA applications.",
		urlPatterns = { "/route" }
)
public class SPAErrorHandler extends HttpServlet {
	private static final long serialVersionUID = 1L;

	Logger logger = Logger.getGlobal();
	
	@Override
	public void init() throws ServletException {
		ServletConfig config = getServletConfig();
		String name = config.getServletName();
		logger.info("Initializing SPA route handler for " + name + "...");
	}
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String originalRequest = (String) request.getAttribute("javax.servlet.error.request_uri");
		String resource = originalRequest;
		// We want to return 404 only for content we know should exist.
		// For instance, i18n can then fall back to other languages.
		// All other paths should get the index file, with status 200.
		// It is then up to the client to parse the route.
		if ((originalRequest != null)
			&& ((originalRequest.indexOf("/locales/") >= 0)
			|| (originalRequest.indexOf("/static/") >= 0))) {
			// This is a resource we think should exist but does not.
			// Let's return the 404, to get this logged and handled.
			logger.info("Returning 404 for " + originalRequest + ".");
		} else {
			// This is not an asset, rather a specified route.
			// Let's return the index file, for the client to handle.
			// Using 200.html as the index file, as we're using React Snap for server side rendering
			resource = "/200.html";
			logger.info("Redirecting request for path " + originalRequest + " to " + resource);
			response.setStatus(200);
		}
        request.getRequestDispatcher(resource).forward(request, response);
	}
}
