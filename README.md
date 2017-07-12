# open.io

## Power users

Add these function to your .bashrc/.profile:

### Openit right from CLI

```sh
function openit() {
  open "http://openit.io/$1"
}
```


Then call it like this: 

```sh
$ openit js/preact
```

### Git clone with openit

```sh
function clone() {
  git clone $(curl -Ls -o /dev/null -w %{url_effective} https://openit.io/$1)
}
```

Then call it like this: 

```sh
$ clone js/preact
```