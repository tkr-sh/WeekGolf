from datetime import datetime, timedelta


def insert_phases(y: int, m: int, d: int=1) -> str:

    # "Rotate" the month by one
    m=~-m%12or 12

    # Get the number of days in the month
    nb_days = (62648012>>m*2&3)+28+(m==2and y%4==0*(y%100>0 or y%400==0))

    start_date = datetime(y, m, d, 20)
    delta = timedelta(days=nb_days//4)

    phase1 = start_date.replace(day=nb_days)

    if m == 12:
        phase1=phase1.replace(year=y-1)

    phase2 = phase1 + delta + timedelta(days=nb_days%4 > 0)
    phase3 = phase2 + delta + timedelta(days=nb_days%4 > 1)
    phase4 = phase3 + delta + timedelta(days=nb_days%4 > 2)

    m=-~m%12or 1
    nb_days = (62648012>>m*2&3)+28+(m==2and y%4==0*(y%100>0 or y%400==0))
    m-=1
    phase_end = datetime(y, (m+1)%12 or 1, d, 20).replace(day=nb_days)

    if phase1.month > phase_end.month and phase2.month > phase1.month:
        phase_end = phase_end.replace(month=12)

    phases = f'("{phase1}", "{phase2}", "{phase3}", "{phase4}", "{phase_end}")'

    return f'INSERT INTO Phases (phase1, phase2, phase3, phase4, phaseend) VALUES {phases};'



# print(insert_phases(2023,1))
# print(insert_phases(2023,2))
# print(insert_phases(2023,3))
# print(insert_phases(2023,12))




for year in range(2023, 2050):
    for month in range(1, 13):
        print(insert_phases(year, month))