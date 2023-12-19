
            {/* Pet Categories */}
            Pet Categories
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                {/* Dogs */}
                <Grid item container alignItems="center" spacing={2}>
                    {filterAnimalsByType('dog').map((dog) => (
                        <Grid item key={`dog-${dog.species}`} xs={6} sm={3}>
                            <Card>
                                <CardContent>
                                    <img
                                        src={`./HomePageAnimals/dog-${dog.pet_ID}.png`}
                                        alt={`Dog ID: ${dog.pet_ID}`}
                                        style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                                    />
                                    <Typography variant="h6" style={{fontWeight: 'bold'}}>
                                        {`${dog.breed}`}
                                        <br />
                                        {`${dog.age}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Cats */}
                <Grid item container spacing={2} alignItems="center">
                    {filterAnimalsByType('cat').map((cat) => (
                        <Grid item key={`cat-${cat.species}`} xs={6} sm={3}>
                            <Card>
                                <CardContent>
                                    <img
                                        src={`./HomePageAnimals/cat-${cat.pet_ID}.png`}
                                        alt={`Cat ${cat.age}`}
                                        style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                                    />
                                    <Typography variant="h6" style={{fontWeight: 'bold' , marginBottom: 0 }}>
                                        {`${cat.breed}`}
                                        <br />
                                        {`${cat.age}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>