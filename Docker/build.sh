lang="$1"

cd $lang

echo "Building $lang""...";

docker build                \
        --no-cache          \
        --rm                \
        -t weekgolf-$lang   \
        .