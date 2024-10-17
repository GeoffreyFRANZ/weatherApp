import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import {Link} from "react-router-dom";
const CocktailList = () => {
    const [cocktails, setCocktails] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';

    const { ref, inView } = useInView({
        threshold: 1.0,
    });

    useEffect(() => {
        const fetchCocktails = async () => {
            setLoading(true);
            try {
                const requests = alphabet.slice(page * 5, (page + 1) * 5).map(letter =>
                    fetch(`${baseUrl}${letter}`).then(response => response.json())
                );
                const results = await Promise.all(requests);
                const newCocktails = results.flatMap(result => result.drinks || []);
                setCocktails(prevCocktails => [...prevCocktails, ...newCocktails]);
                setLoading(false);
                if ((page + 1) * 5 >= alphabet.length) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Erreur:', error);
                setLoading(false);
            }
        };

        if (hasMore) {
            fetchCocktails();
        }
    }, [page, hasMore]);

    useEffect(() => {
        if (inView && !loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }, [inView, loading, hasMore]);

    return (
        <div className={'App'}>
            <header className={'App-header'}>
            <h1 style={{width:'100%'}} className={'text-danger'}>Liste des Cocktails</h1>

            <div className={'d-flex  flex-wrap'}>
                {cocktails.map((cocktail, index) => (
                    <div key={index} className="card bg-dark bg-opacity-25 ms-3 mt-3" style={{width: '18rem'}}>
                        <img src={cocktail['strDrinkThumb']} className="card-img-top" alt="Cocktail"/>
                        <div className="card-body">
                            <h5 className="card-title text-white">{cocktail['strDrink']}</h5>
                            <p className="card-text text-white">{cocktail['strInstructions']}</p>
                        </div>
                        <div className="card-footer border-0">
                            <Link to={`/cocktails/${cocktail['idDrink']}`} className="btn btn-primary">Go to Details</Link>                        </div>
                        </div>
                        ))}
                    </div>
                {hasMore && <div ref={ref} className={'w-100'} style={{ height: '20px', width:'100%' }} />}
            {loading && <p style={{width:'100%'}}>Chargement...</p>}
            {!hasMore && " "}
            </header>
        </div>
    );
};

export default CocktailList;
