/**
 * This java servlet class sends data through html form(admin.html) to the postgreSQL database table Product Dimension.
 */

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/SaveProductDimension")
public class SaveProductDimension extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Response set as html
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Retrieve data from html elements
        int length = Integer.parseInt(request.getParameter("length"));
        int width = Integer.parseInt(request.getParameter("width"));
        int product_id = Integer.parseInt(request.getParameter("product_id"));

        int status = 0;

        try {

            // Establish Database Connection
            Connection connection = DatabaseConnection.getConnection();

            // Insert data query
            PreparedStatement preparedStatement = connection.prepareStatement(
                    "insert into product_dimension(length, width ,product_id) values (?,?,?)");

            preparedStatement.setInt(1, length);
            preparedStatement.setInt(2, width);
            preparedStatement.setInt(3, product_id);

            // Execute query
            status = preparedStatement.executeUpdate();

            // Validate query status
            if (status > 0) {
                out.print("<p>Record saved successfully!</p>");
            } else {
                out.print("<p>Unable to save record!</p>");
            }
            request.getRequestDispatcher("admin").include(request, response);

            // Close database connection
            connection.close();

        } catch (Exception ex) {
            out.print("<p>Unable to save record!</p>");
            request.getRequestDispatcher("admin").include(request, response);
        }
        out.close();
    }
}