from memory_profiler import profile


@profile
def main():
    n,r = map(int,input().split())
    u = 1,2
    for x in range(999):
        if sum(x-y in u and x<y*2for y in u) == 1:u+=x,
    exec("n=u[n-1];" * r)
    print(n)


if __name__ == '__main__':
    main()
