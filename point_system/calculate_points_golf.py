from math import*


# rank: The rank of the person
# same_rank_nb: The nb of person with the same rank (usefull when rank == 1)
# total: the total of people that tried
# multiplier: the multiplier coefficient (usefull when rank == 1)


def calculate_points(rank, same_rank_nb, total):

    multiplier = 1

    if rank == 1:
        multiplier = min(max(exp((total/same_rank_nb)/70)/6 + 0.8,1),3)
        # same_rank < 1% => mutltiplier: 3
        # same_rank > 10% => mutltiplier: 1

    score = round( (1 + log10(total) / 6) * (total - rank + 1)/(total) * 1000 * multiplier)

    return score


rank = 1
same_rank_nb = 1
total = 123


score = calculate_points(rank, same_rank_nb, total)


print(score)