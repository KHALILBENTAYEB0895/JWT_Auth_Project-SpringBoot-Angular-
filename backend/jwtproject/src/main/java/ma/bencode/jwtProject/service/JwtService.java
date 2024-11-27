package ma.bencode.jwtProject.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import ma.bencode.jwtProject.model.User;
import ma.bencode.jwtProject.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${access.token}")
    private long accessTokenExpire;

    @Value("${refresh.token}")
    private long refreshTokenExpire;
    
    private final TokenRepository tokenRepository;
    public JwtService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public boolean isValid(String token, UserDetails user) {
        String username = extractUsername(token);

        boolean validToken = tokenRepository
                .findByAccessToken(token)
                .map(t -> !t.isLoggedOut())
                .orElse(false);

        return (username.equals(user.getUsername())) && !isTokenExpired(token) && validToken;
    }

    public boolean isValidRefreshToken(String token, User user) {
        String username = extractUsername(token);

        boolean validRefreshToken = tokenRepository
                .findByRefreshToken(token)
                .map(t -> !t.isLoggedOut())
                .orElse(false);

        return (username.equals(user.getUsername())) && !isTokenExpired(token) && validRefreshToken;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token){
        return Jwts
                .parser() // Initialise un JwtParser pour analyser le token.
                .verifyWith(getSigninKey()) // Vérifie la signature du token pour s'assurer qu'il n'a pas été modifié.
                .build() // Elle prépare l'objet pour le parsing du token JWT.
                .parseSignedClaims(token) // Récupère et décode le payload du token, où sont stockées les informations utiles.
                .getPayload(); //Le payload contient les claims du token,
    }

    private SecretKey getSigninKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(User user) {
        return generateToken(user, accessTokenExpire);
    }
    public String generateRefreshToken(User user) {
        return generateToken(user, refreshTokenExpire );
    }
    private String generateToken(User user, long expireTime) {
        String token = Jwts
                .builder()
                .subject(user.getUsername())
                .claim("role",user.getRole())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expireTime ))
                .signWith(getSigninKey())
                .compact();

        return token;
    }
}
