# Resolutions corresponsing to zoom for fit page to height

2560 x 1440 - 122
1920 x 1080 - 90
1440 x 900 - 74
1536 x 864 - 71
1366 x 768 - 63
1280 x 720 - 59
default - 80.6768

# To generate the documents

## Compressing

```bash
qpdf --qdf --object-streams=disable Interesume\ v1.2-public.pdf expanded.pdf
```


## Editing the zoom levels

```bash
brew install bbe

bbe -e 's/0.806768/0.59/' expanded.pdf > expanded-59.pdf
bbe -e 's/0.806768/0.63/' expanded.pdf > expanded-63.pdf
bbe -e 's/0.806768/0.71/' expanded.pdf > expanded-71.pdf
bbe -e 's/0.806768/0.74/' expanded.pdf > expanded-74.pdf
bbe -e 's/0.806768/0.90/' expanded.pdf > expanded-90.pdf
bbe -e 's/0.806768/1.22/' expanded.pdf > expanded-122.pdf
```

## Recompressing

```bash
qpdf expanded-59.pdf Interesume\ v1.2-public-59.pdf
qpdf expanded-63.pdf Interesume\ v1.2-public-63.pdf
qpdf expanded-71.pdf Interesume\ v1.2-public-71.pdf
qpdf expanded-74.pdf Interesume\ v1.2-public-74.pdf
qpdf expanded-90.pdf Interesume\ v1.2-public-90.pdf
qpdf expanded-122.pdf Interesume\ v1.2-public-122.pdf
```