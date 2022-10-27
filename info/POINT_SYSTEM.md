# Point system
## Sumarry
- [Point system](#point-system)
  - [Sumarry](#sumarry)
  - [Golf points](#golf-points)
    - [Variables](#variables)
    - [Formula](#formula)
  - [Upgrades points](#upgrades-points)
    - [Variables](#variables-1)
    - [Formula](#formula-1)
    - [Note](#note)

## Golf points
### Variables
- rank (The rank of the person on the problem of the week by language)
- same_rank_nb (The number of people with the same number of bytes)
- total (Total number of people who participated in the challenge in the given language)
- multiplier (multiplier is a coefficient that multiplies the first solution by its value under certain conditions)
### Formula
Multiplier:  `min( max( exp( ( total / same_rank_nb ) / 70 ) / 6 + 0.8 , 1 ) , 3)` if rank == 1, else 1
Score: `round( ( 1 + log10(total) / 6 ) * ( total - rank + 1) / ( total ) * 1000 * multiplier )`

## Upgrades points
### Variables
- total (Total number of people who participated in the challenge in the given language)
- before_bytes_nb (The number of bytes before the upgrade)
- new_bytes_nb (The number of bytes after the upgrade)
- diff = before_bytes_nb - new_bytes_nb
### Formula
Score: `log5( (diff>100?100:diff) + 10) * 3600 * log( 1 + (float)total / 100 );`
### Note
If there are two improvements like for example:
100 -> 90 then 90 -> 80 by the same user, it will be counted as 100 -> 80