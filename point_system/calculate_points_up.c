#include <stdio.h>
#include <math.h>


float log5(n) {
    return log(n) / log(5);
}


float calculate_points(total, before_bytes_nb, new_bytes_nb){

    int diff;
    float score;


    diff = before_bytes_nb - new_bytes_nb;

    score = log5((diff>100?100:diff) + 10) * 3600 * log( 1 + (float)total / 100);


    return score;
}


int main(){
    
    // total: the total of people that tried
    // before_bytes_nb: The previous solution nb of bytes
    // new_bytes_nb: The new solution nb of bytes

    int total = 1 , before_bytes_nb = 286 , new_bytes_nb = 222;
    float score;

    score = calculate_points(total, before_bytes_nb, new_bytes_nb);

    printf("%f\n", score);

    return 0;
}