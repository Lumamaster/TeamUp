import java.io.*;
import java.math.*;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.stream.*;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;


class Result {

    /*
     * Complete the 'findHighPoints' function below.
     *
     * The function is expected to return a 2D_BOOLEAN_ARRAY.
     * The function accepts 2D_INTEGER_ARRAY elevations as parameter.
     */

    public static boolean[][] findHighPoints(int[][] elevations) {
        // Write your code here
        boolean[][] high = new boolean[elevations.length][elevations[0].length];
        System.out.println(elevations.length);
        System.out.println(elevations[0].length);

        for (int i = 0; i < elevations.length; i++) {
            for (int j = 0; j < elevations[0].length; j++) {
                if (i == 0) {
                    if (j == 0) {
                        if (elevations[i][j] > elevations[i+1][j] && elevations[i][j] > elevations[i+1][j+1] && elevations[i][j] > elevations[i][j+1]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    } else if (j == (elevations[0].length - 1)) {
                        if (elevations[i][j] > elevations[i][j-1] && elevations[i][j] > elevations[i+1][j-1] && elevations[i][j] > elevations[i+1][j]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    } else {
                        if (elevations[i][j] > elevations[i][j-1] && elevations[i][j] > elevations[i+1][j-1] && elevations[i][j] > elevations[i+1][j] && elevations[i][j] > elevations[i+1][j+1] && elevations[i][j] > elevations[i][j+1]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    }
                } else if (i == (elevations.length - 1)) {
                    if (j == 0) {
                        if (elevations[i][j] > elevations[i-1][j] && elevations[i][j] > elevations[i-1][j+1] && elevations[i][j] > elevations[i][j+1]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    } else if (j == elevations[0].length - 1) {
                        if (elevations[i][j] > elevations[i][j-1] && elevations[i][j] > elevations[i-1][j-1] && elevations[i][j] > elevations[i-1][j]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    } else {
                        if (elevations[i][j] > elevations[i][j-1] && elevations[i][j] > elevations[i-1][j-1] && elevations[i][j] > elevations[i-1][j] && elevations[i][j] > elevations[i-1][j+1] && elevations[i][j] > elevations[i][j+1]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    }
                } else {
                    if (j == 0) {
                        if (elevations[i][j] > elevations[i-1][j] && elevations[i][j] > elevations[i-1][j+1] && elevations[i][j] > elevations[i][j+1] && elevations[i][j] > elevations[i+1][j+1] && elevations[i][j] > elevations[i+1][j]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    } else if (j == (elevations[0].length - 1)) {
                        if (elevations[i][j] > elevations[i-1][j] && elevations[i][j] > elevations[i-1][j-1] && elevations[i][j] > elevations[i][j-1] && elevations[i][j] > elevations[i+1][j-1] && elevations[i][j] > elevations[i+1][j]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    } else {
                        if (elevations[i][j] > elevations[i-1][j-1] && elevations[i][j] > elevations[i-1][j] && elevations[i][j] > elevations[i-1][j+1] && elevations[i][j] > elevations[i][j-1] && elevations[i][j] > elevations[i][j+1] && elevations[i][j] > elevations[i+1][j-1] && elevations[i][j] > elevations[i+1][j] && elevations[i][j] > elevations[i+1][j+1]) {
                            high[i][j] = true;
                        } else {
                            high[i][j] = false;
                        }
                    }
                }
            }
        }


        return high;
    }

}

public class Solution {