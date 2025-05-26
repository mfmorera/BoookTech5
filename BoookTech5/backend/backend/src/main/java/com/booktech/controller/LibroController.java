package com.booktech.controller;

import com.booktech.entity.Libro;
import com.booktech.repository.LibroRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "*")
public class LibroController {

    private final LibroRepository libroRepository;

    public LibroController(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
    }

    @GetMapping
    public List<Libro> getLibros(@RequestParam(required = false) String q) {
        if (q != null && !q.isEmpty()) {
            return libroRepository.findByTituloContainingIgnoreCase(q);
        } else {
            return libroRepository.findAll();
        }
    }

    @PostMapping
    public Libro guardarLibro(@RequestBody Libro libro) {
        return libroRepository.save(libro);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Libro> getLibroPorId(@PathVariable Long id) {
        Optional<Libro> libro = libroRepository.findById(id);
        return libro.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Libro> actualizarLibro(@PathVariable Long id, @RequestBody Libro libroDetalles) {
        Optional<Libro> libroOpt = libroRepository.findById(id);
        if (!libroOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Libro libro = libroOpt.get();
        libro.setTitulo(libroDetalles.getTitulo());
        libro.setAutor(libroDetalles.getAutor());
        libro.setPrecio(libroDetalles.getPrecio());
        return ResponseEntity.ok(libroRepository.save(libro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        if (!libroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        libroRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
