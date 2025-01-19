/// <summary>
/// Hey Chris, I've written every class in one file right now. (This is not a good practice though)
/// I did it so that you can easily run and test the code in any online C# compiler without having to install C# locally.
/// You can test here: https://www.programiz.com/csharp-programming/online-compiler/
/// </summary>
using System;
using System.Text;

namespace MatrixLibrary
{
    /// <summary>
    /// I decided to put everything in one namespace to easily access the Matrix class and its helper functions.
    /// It also has a test program to test the Matrix class. (will be removed later) 
    /// </summary>
    public class Matrix
    {
        /// <summary>
        /// This class represents a matrix.
        /// It has a constructor and overrrides for various operators to support matrix operations.        
        /// </summary>
        internal float[,] data;
        public Matrix(float[,] inputData)
        {
            /// <summary>
            /// Constructor for the Matrix class.
            /// It takes a 2D array of floats as input and stores it in the data field.
            /// It also checks if the input data is a valid matrix.
            /// </summary>
            if (!MatrixHelpers.IsValidMatrix(inputData))
                throw new ArgumentException("Invalid matrix data");

            this.data = inputData;
        }
        public static Matrix identity(int size)
        {
            /// <summary>
            /// Creates an identity matrix of the given size. (size x size)
            /// </summary>
            float[,] result = new float[size, size];

            for (int i = 0; i < size; i++)
                result[i, i] = 1; // all diagonal elements

            return new Matrix(result);
        }
        /// <summary>
        /// Creates a zero matrix of the given size. (rows x cols)
        /// </summary>
        public static Matrix zero(int rows, int cols) => new Matrix(new float[rows, cols]);
        public override string ToString()
        {
            /// <summary>
            /// Overides the string representation of the matrix to show the matrix when printed.
            /// </summary>
            StringBuilder builder = new StringBuilder();
            int maxElementWidth = MatrixHelpers.GetMaxElementWidth(data); // for padding based on the row with maximum width

            for (int i = 0; i < data.GetLength(0); i++)
            {
                builder.Append("| "); // start of the row

                for (int j = 0; j < data.GetLength(1); j++)
                    builder.Append(data[i, j].ToString().PadRight(maxElementWidth) + " ");

                builder.AppendLine("|"); // end of the row
            }

            return builder.ToString();
        }
        public static Matrix operator +(Matrix m1, Matrix m2)
        {
            /// <summary>
            /// Overloads the + operator to add two matrices.
            /// </summary>
            if (m1.data.GetLength(0) != m2.data.GetLength(0) || m1.data.GetLength(1) != m2.data.GetLength(1))
                throw new ArgumentException("Matrices must have the same dimensions to be added.");

            float[,] result = new float[m1.data.GetLength(0), m1.data.GetLength(1)];

            for (int i = 0; i < m1.data.GetLength(0); i++)
                for (int j = 0; j < m1.data.GetLength(1); j++)
                    result[i, j] = m1.data[i, j] + m2.data[i, j]; // add the corresponding elements

            return new Matrix(result);
        }
        public static Matrix operator -(Matrix m1, Matrix m2)
        {
            /// <summary>
            /// Overloads the - operator to subtract two matrices.
            /// </summary>
            if (m1.data.GetLength(0) != m2.data.GetLength(0) || m1.data.GetLength(1) != m2.data.GetLength(1))
                throw new ArgumentException("Matrices must have the same dimensions to be subtracted.");

            float[,] result = new float[m1.data.GetLength(0), m1.data.GetLength(1)];

            for (int i = 0; i < m1.data.GetLength(0); i++)
                for (int j = 0; j < m1.data.GetLength(1); j++) // subtract the corresponding elements of the second matrix from the first
                    result[i, j] = m1.data[i, j] - m2.data[i, j];

            return new Matrix(result);
        }
        public static Matrix operator *(Matrix m, float scalar)
        {
            /// <summary>
            /// Overloads the * operator to multiply a matrix with a scalar.
            /// </summary>
            int rows = m.data.GetLength(0);
            int cols = m.data.GetLength(1);
            float[,] result = new float[rows, cols];

            for (int i = 0; i < rows; i++)
                for (int j = 0; j < cols; j++)
                    result[i, j] = m.data[i, j] * scalar; // multiply each element with the scalar

            return new Matrix(result);
        }
        /// <summary>
        /// If the order of the operands is reversed.
        /// </summary>
        public static Matrix operator *(float scalar, Matrix m) => m * scalar;
        public static Matrix operator *(Matrix m1, Matrix m2)
        {
            /// <summary>
            /// Overloads the * operator to multiply two matrices.
            /// </summary>
            if (m1.data.GetLength(1) != m2.data.GetLength(0)) // no. of cols of m1 should be equal to rows of m2 for multiplication
                throw new ArgumentException("The number of columns in the first matrix must be equal to the number of rows in the second matrix.");

            int rows = m1.data.GetLength(0);
            int cols = m2.data.GetLength(1);
            float[,] result = new float[rows, cols];

            for (int i = 0; i < rows; i++)
                for (int j = 0; j < cols; j++)
                    for (int k = 0; k < m1.data.GetLength(1); k++)
                        result[i, j] += m1.data[i, k] * m2.data[k, j]; // dot product of the row of m1 and the column of m2

            return new Matrix(result);
        }
        public static Matrix operator !(Matrix m)
        {
            /// <summary>
            /// Overloads the ! operator to transpose a matrix.
            /// </summary>
            int rows = m.data.GetLength(0);
            int cols = m.data.GetLength(1);
            float[,] transposedData = new float[cols, rows];

            for (int i = 0; i < cols; i++)
                for (int j = 0; j < rows; j++)
                    transposedData[i, j] = m.data[j, i]; // interchange the rows and columns of the matrix

            return new Matrix(transposedData);
        }
        public static Matrix operator ~(Matrix m)
        {
            /// <summary>
            /// Overloads the ~ operator to find the inverse of a matrix.S
            /// </summary>
            if (m.data.GetLength(0) != m.data.GetLength(1))
                throw new ArgumentException("The matrix must be square to find its inverse.");

            int n = m.data.GetLength(0);
            float[,] result = new float[n, n];
            float[,] augmentedMatrix = new float[n, 2 * n];

            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    augmentedMatrix[i, j] = m.data[i, j]; // copy the matrix to the left side of the augmented matrix

            for (int i = 0; i < n; i++)
                augmentedMatrix[i, i + n] = 1; // set the right side of the augmented matrix to the identity matrix

            for (int i = 0; i < n; i++)
            {
                MatrixHelpers.Pivot(augmentedMatrix, i); // pivot the augmented matrix

                float diagonal = augmentedMatrix[i, i];

                if (Math.Abs(diagonal) < 1e-10) // if the diagonal element is zero
                    throw new ArgumentException("The matrix is singular and does not have an inverse.");

                for (int j = 0; j < 2 * n; j++)
                    augmentedMatrix[i, j] /= diagonal; // divide the current row by the diagonal element

                for (int k = 0; k < n; k++)
                {
                    if (k != i)
                    {
                        float factor = augmentedMatrix[k, i];

                        for (int j = 0; j < 2 * n; j++)
                            augmentedMatrix[k, j] -= factor * augmentedMatrix[i, j]; // subtract the factor times the current row from the other rows
                    }
                }                
            }

            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    result[i, j] = augmentedMatrix[i, j + n]; // copy the right side of the augmented matrix to the result matrix

            return new Matrix(result);

        }        
        public Matrix TranslateMatrix(float[] t)
        {
            /// <summary>
            /// Translates the given matrix by the given translation vector.
            /// </summary>                                                            
            int dimension = t.Length;

            if (data.GetLength(0) != 1 || data.GetLength(1) != dimension)
                throw new ArgumentException("The matrix must be a vector of same dimension as the translation vector.");

            Matrix translationMatrix = MatrixHelpers.translationMatrix(t);

            return translationMatrix * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix ScaleMatrix(float[] s)
        {
            /// <summary>
            /// Scales the given matrix by the given scaling vector.
            /// </summary>                                                            
            int dimension = s.Length;

            if (data.GetLength(0) != 1 || data.GetLength(1) != dimension)
                throw new ArgumentException("The matrix must be a vector of same dimension as the scaling vector.");

            Matrix scalingMatrix = MatrixHelpers.scalingMatrix(s);

            return scalingMatrix * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix Rotate2D(float angle)
        {
            /// <summary>
            /// Rotates the given matrix by the given angle.
            /// </summary>                                                            
            if (data.GetLength(0) != 1 || data.GetLength(1) != 2)
                throw new ArgumentException("The matrix must be a 2D vector for 2D rotation");

            Matrix rotationMatrix = MatrixHelpers.rotation2D(angle);

            return rotationMatrix * this;
        }
        public Matrix Rotate3D(float? rx = null, float? ry = null, float? rz = null)
        {
            /// <summary>
            /// Rotates the given matrix by the given angles about the x, y and z axes respectively.
            /// </summary>
            if (data.GetLength(0) != 3 || data.GetLength(1) != 1)
                throw new ArgumentException("The matrix must be a 3D vector for 3D rotation.");

            return MatrixHelpers.rotation3D(rx, ry, rz) * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix WorldSpaceTransformation(float[] ts = null, float[] ss = null, float[] rs = null)
        {
            /// <summary>
            /// Returns the world space transformation of this matrix
            /// P = T * Rz * Ry * Rx * S * I * p
            /// Performs post-multiplication of the given matrix with the given translation, scaling and rotation vectors.
            /// </summary>
            if (data.GetLength(0) != 3 || data.GetLength(1) != 1)
                throw new ArgumentException("The original matrix must be 1x4 for world space transformation.");

            return MatrixHelpers.WorldSpaceTransformationMatrix(ts, ss, rs) * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix ObjectSpaceTransformation(float[] ts = null, float[] ss = null, float[] rs = null)
        {
            /// <summary>
            /// Returns the object space transformation of this matrix
            /// P = S * Rz * Ry * Rx * T * I * p
            /// Performs post-multiplication of the given matrix with the given translation, scaling and rotation vectors.
            if (data.GetLength(0) != 3 || data.GetLength(1) != 1)
                throw new ArgumentException("The original matrix must be 1x4 for object space transformation.");

            return MatrixHelpers.ObjectSpaceTransformationMatrix(ts, ss, rs) * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix CameraViewSpaceTransformation(Matrix camWSTMatrix)
        {
            /// <summary>
            /// Returns the camera view space transformation of this matrix
            /// </summary>            
            if (data.GetLength(0) != 3 || data.GetLength(1) != 1)
                throw new ArgumentException("The original matrix must be 1x4 for camera view space transformation.");
            
            if (camWSTMatrix.data.GetLength(0) != 4 || camWSTMatrix.data.GetLength(1) != 4)
                throw new ArgumentException("The camera world space transformation matrix must be 4x4.");

            return MatrixHelpers.CameraViewSpaceMatrix(camWSTMatrix) * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix PerspectiveProjection(float fov, float aspect, float near, float far)
        {
            /// <summary>
            /// Returns the perspective projection of this matrix
            /// </summary>
             if (data.GetLength(0) != 3 || data.GetLength(1) != 1)
                throw new ArgumentException("The original matrix must be 1x4 for perspective projection.");

             return MatrixHelpers.PerspectiveProjectionMatrix(fov, aspect, near, far) * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix OrthographicProjection(float left, float right, float bottom, float top, float near, float far)
        {
            /// <summary>
            /// Returns the orthographic projection of this matrix
            /// </summary>
            if (data.GetLength(0) != 3 || data.GetLength(1) != 1)
                throw new ArgumentException("The original matrix must be 1x4 for orthographic projection.");
                                      
             return MatrixHelpers.OrthographicProjectionMatrix(left, right, bottom, top, near, far) * MatrixHelpers.HomogenizeVector(this);
        }
        public Matrix ModelViewProjection(Matrix ostMatrix, Matrix wstMatrix, Matrix cvsMatrix, Matrix projectionMatrix)
        {
            /// <summary>
            /// Returns the model view projection of this matrix
            /// </summary>
            if (data.GetLength(0) != 3 || data.GetLength(1) != 1)
                throw new ArgumentException("The original matrix must be 1x4 for model view projection.");
                                                           
            return MatrixHelpers.ModelViewProjectionMatrix(ostMatrix, wstMatrix, cvsMatrix, projectionMatrix) * MatrixHelpers.HomogenizeVector(this);
        }
        public static bool operator ==(Matrix m1, Matrix m2)
        {
            /// <summary>
            /// Overloads the == operator to check if two matrices are equal.
            /// </summary>
            if (ReferenceEquals(m1, m2) || m1 is null && m2 is null)
                return true;

            if (m1 is null || m2 is null)
                return false;

            if (m1.data.GetLength(0) != m2.data.GetLength(0) || m1.data.GetLength(1) != m2.data.GetLength(1))
                return false;

            for (int i = 0; i < m1.data.GetLength(0); i++)
                for (int j = 0; j < m1.data.GetLength(1); j++)
                    if (m1.data[i, j] != m2.data[i, j]) // if any corresponding elements are not equal
                        return false;

            return true; // if all corresponding elements are equal
        }
        /// <summary>
        /// Overloads the != operator to check if two matrices are not equal.
        /// </summary>
        public static bool operator !=(Matrix m1, Matrix m2) => !(m1 == m2);
        public override bool Equals(object obj)
        {
            /// <summary>
            /// C# somehow wanted me to override the Equals method if I overrode the == operator.
            /// Its basically hase the same functionality as the == operator.
            /// But it also does some type checking to make sure that the object is a matrix.
            /// </summary>
            if (obj == null || this.GetType() != obj.GetType())
                return false;

            Matrix m = (Matrix)obj;

            return this == m;
        }
        public override int GetHashCode()
        {
            /// <summary>
            /// I had to override this method because I overrode the Equals method (again according to C#).
            /// Idk what this method does, ChatGPT did it :]
            /// </summary>
            unchecked // Overflow is fine, just wrap
            {
                int hash = 17;
                foreach (int value in data)
                {
                    hash = hash * 31 + value;
                }
                return hash;
            }
        }
    }    
}