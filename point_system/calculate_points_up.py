from math import*

# total: the total of people that tried
# before_bytes_nb: The previous solution nb of bytes
# new_bytes_nb: The new solution nb of bytes


def calculate_points(total, before_bytes_nb, new_bytes_nb):

    diff = before_bytes_nb - new_bytes_nb

    score = log(min(diff, 100) + 10, 5) * 3600 * log(1 + total/100)

    return score


total = 100
before_bytes_nb = 101
new_bytes_nb = 100

score = calculate_points(total, before_bytes_nb, new_bytes_nb)

print(score)