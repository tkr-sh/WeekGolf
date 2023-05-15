def ascii_table_to_sql_inserts(ascii_table: str, table_name: str) -> str:
    """
    Convert an ASCII SQL table to INSERT INTO VALUES SQL statements.
    :param ascii_table: An ASCII SQL table string.
    :param table_name: The name of the table to insert the values into.
    :return: A string of SQL INSERT INTO VALUES statements.
    """
    # Split the ASCII table into rows
    rows = ascii_table.strip().split('\n')

    # Extract the column names from the first row
    columns = rows[0].split('|')
    columns = [col.strip() for col in columns if col.strip()]

    print(len(columns))

    # Build the SQL INSERT INTO VALUES statement for each row
    values_statements = []
    for row in rows[1:]:
        values = row.split('|')

        values = ["NULL" if len(val.strip()) == 0 else val.strip() for val in values[1:]]

        # Check that the number of values matches the number of columns
        # if len(values) - 1 != len(columns):
        #     raise ValueError('The number of values does not match the number of columns.')

        # Build the SQL INSERT INTO VALUES statement
        values_str = ', '.join([f"'{val}'" for val in values])
        sql_statement = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({values_str});"
        values_statements.append(sql_statement)

    return '\n'.join(values_statements)

PATH = "src/api/v1/tmp/ascii_sql"

print(ascii_table_to_sql_inserts(open(PATH).read(), "Solutions"))